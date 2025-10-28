from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
import jwt
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
# Usando SQLite para simplicidade e evitar problemas de Docker/PostgreSQL por enquanto
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL_SQLITE', 'sqlite:///docgestor.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Chave secreta para JWT (apenas para simulação)
app.config['SECRET_KEY'] = 'super-secret-key-for-jwt-simulation' 
db = SQLAlchemy(app)

# Modelos de dados
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    position = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    hireDate = db.Column(db.String(10), nullable=False) # Armazenar como string YYYY-MM-DD
    status = db.Column(db.String(50), default='Pendente') # OK, Pendente, Alerta
    # documents = db.relationship('Document', backref='employee', lazy=True)
    # vacations = db.relationship('Vacation', backref='employee', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'cpf': self.cpf,
            'position': self.position,
            'department': self.department,
            'hireDate': self.hireDate,
            'status': self.status
        }

# --- Rota de Autenticação (SIMULADA) ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    # Esta rota é apenas para satisfazer o frontend que espera um token
    # O login real é simulado no frontend, mas o token é gerado aqui
    data = request.json
    email = data.get('email')
    
    # Simulação de usuário e role
    if email == 'admin@docgestor.com':
        role = 'admin'
        user_id = 1
        name = 'Admin'
    elif email == 'user@docgestor.com':
        role = 'user'
        user_id = 2
        name = 'Usuário Comum'
    else:
        # Se o frontend não estiver usando o login simulado, ele pode tentar chamar esta rota.
        # Retornamos um token genérico para não quebrar a aplicação.
        role = 'user'
        user_id = 999
        name = 'Visitante'

    # Geração de token JWT simulado
    token = jwt.encode({
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': {
            'id': user_id,
            'name': name,
            'email': email,
            'role': role
        }
    }), 200

# Rotas da API
@app.route('/')
def home():
    return 'API Doc-Gestor RH está funcionando!'

@app.route('/api/employees', methods=['POST'])
def create_employee():
    data = request.json
    
    if not data or not all(key in data for key in ['name', 'email', 'cpf', 'position', 'department', 'hireDate']):
        return jsonify({'error': 'Dados incompletos'}), 400

    if Employee.query.filter_by(email=data['email']).first() or Employee.query.filter_by(cpf=data['cpf']).first():
        return jsonify({'error': 'Email ou CPF já cadastrado'}), 409

    new_employee = Employee(
        name=data['name'],
        email=data['email'],
        cpf=data['cpf'],
        position=data['position'],
        department=data['department'],
        hireDate=data['hireDate']
    )

    try:
        db.session.add(new_employee)
        db.session.commit()
        return jsonify(new_employee.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao salvar no banco de dados: {str(e)}'}), 500

@app.route('/api/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees]), 200

# Rota para criar o banco de dados (apenas para desenvolvimento)
@app.route('/init_db')
def init_db():
    with app.app_context():
        db.create_all()
    return 'Banco de dados inicializado!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Cria as tabelas se não existirem
    app.run(debug=False, host='0.0.0.0', port=5001)

