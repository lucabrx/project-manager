# Stage 1: Build the native executable using Quarkus native image builder
FROM quay.io/quarkus/ubi-quarkus-native-image:22.3-java17 as build

# Set the working directory inside the image
WORKDIR /app

# Copy Maven/Gradle dependencies descriptors and application source code
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle gradle.properties ./
COPY src ./src

# Set the correct user and group ID
ARG USER_ID=1000
ARG GROUP_ID=1000

# Create the .gradle directory and set ownership
RUN mkdir -p /app/.gradle && \
    chown -R ${USER_ID}:${GROUP_ID} /app/.gradle

# Build the native executable
RUN ./gradlew clean build -Dquarkus.package.type=native -Dquarkus.native.container-build=true

# Stage 2: Create a minimal Docker image for the native executable
FROM ubi8/ubi-minimal

# Set environment variables for Quarkus
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# Set the working directory
WORKDIR /work/application

# Copy the native binary from the build stage
COPY --from=build /app/build/*-runner /work/application/application

# Copy necessary key files
COPY publicVerificationKey.pem /work/application/conf/publicVerificationKey.pem
COPY rsaPrivateKey.pem /work/application/conf/rsaPrivateKey.pem
COPY privateSigningKey.pem /work/application/conf/privateSigningKey.pem

# Create conf directory
RUN mkdir /work/application/conf

# Set the correct user and group ID
ARG USER_ID=1000
ARG GROUP_ID=1000

# Set ownership for the application directory
RUN chown -R ${USER_ID}:${GROUP_ID} /work/application

# Expose the default port
EXPOSE 8080

# Command to run the application
CMD ["./application"]
