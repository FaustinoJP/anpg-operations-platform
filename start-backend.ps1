Set-Location -Path "$PSScriptRoot\backend"
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run start:dev
