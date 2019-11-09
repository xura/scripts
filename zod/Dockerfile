FROM microsoft/dotnet:3.0-sdk AS build-env
WORKDIR /app

# copy fsproj and restore as distinct layers
# COPY nuget.config ./
COPY zod/*.fsproj ./
RUN dotnet restore

# copy everything else and build
COPY ./zod .
RUN dotnet publish -c Release -r linux-x64 -o out

# build runtime image
FROM microsoft/dotnet:3.0-runtime-deps
WORKDIR /app
COPY --from=build-env /app/out ./
ENTRYPOINT ["./zod"]