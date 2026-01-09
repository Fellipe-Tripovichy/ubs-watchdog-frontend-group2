# Build .net sdk
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR "./"

# Copiando projetos
COPY ["UBS.Watchdog.API/UBS.Watchdog.API.csproj", "UBS.Watchdog.API/"]
COPY ["UBS.Watchdog.Application/UBS.Watchdog.Application.csproj", "UBS.Watchdog.Application/"]
COPY ["UBS.Watchdog.Domain/UBS.Watchdog.Domain.csproj", "UBS.Watchdog.Domain/"]
COPY ["UBS.Watchdog.Infrastructure/UBS.Watchdog.Infrastructure.csproj", "UBS.Watchdog.Infrastructure/"]
# Restaurando projetos
RUN dotnet restore "UBS.Watchdog.API/UBS.Watchdog.API.csproj"

# Copiando código
COPY . .

# Build com restore
RUN dotnet build "UBS.Watchdog.sln" -c Release

# Build e publish
RUN dotnet publish "./UBS.Watchdog.API/UBS.Watchdog.API.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-build

# Build runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expondo porta
EXPOSE 5432
ENTRYPOINT ["dotnet", "UBS.Watchdog.API.dll"]