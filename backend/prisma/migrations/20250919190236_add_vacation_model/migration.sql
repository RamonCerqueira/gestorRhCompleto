-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "currentAcquisitivePeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastVacationEndDate" TIMESTAMP(3),
ADD COLUMN     "vacationDaysAvailable" INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "public"."vacations" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "isAbonoPecuniario" BOOLEAN NOT NULL DEFAULT false,
    "abonoDays" INTEGER,
    "aquisitivePeriodStart" TIMESTAMP(3) NOT NULL,
    "aquisitivePeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."vacations" ADD CONSTRAINT "vacations_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
