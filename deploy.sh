#!/bin/bash

echo "🚀 Iniciando deploy do Doc-Gestor RH..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
read -p "Deseja remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo imagens antigas..."
    docker-compose down --rmi all
fi

# Build e start dos containers
echo "🔨 Fazendo build e iniciando containers..."
docker-compose up -d --build

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

# Executar migrações do banco
echo "🗄️ Executando migrações do banco de dados..."
docker-compose exec backend npx prisma migrate deploy

# Executar seed do banco
echo "🌱 Populando banco de dados com dados iniciais..."
docker-compose exec backend npx prisma db seed

echo "✅ Deploy concluído!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "👤 Usuários de teste:"
echo "   Admin: admin@docgestor.com / admin123"
echo "   User:  user@docgestor.com / user123"

