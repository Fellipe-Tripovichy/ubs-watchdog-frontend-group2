# Build .net sdk
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR "./"

# Copiando projetos
COPY . .
# Restaurando projetos
RUN dotnet restore "UBS.Watchdog.API/UBS.Watchdog.API.csproj"

# Build com restore
RUN dotnet build "UBS.Watchdog.API/UBS.Watchdog.API.csproj" -c Release -o /app/build

# Build e publish
RUN dotnet publish "UBS.Watchdog.API/UBS.Watchdog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# porta
EXPOSE 5433

# Copiar arquivos publicados do stage anterior
COPY --from=build /app/publish .

# Criar diretório de logs
RUN mkdir -p /app/logs

# Definir variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5433
ENV ASPNETCORE_ENVIRONMENT=Development

# Ponto de entrada
ENTRYPOINT ["dotnet", "UBS.Watchdog.API.dll"]
