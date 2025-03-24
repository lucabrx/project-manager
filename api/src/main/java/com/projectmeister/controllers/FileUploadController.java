package com.projectmeister.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.UUID;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/v1/upload")
@Authenticated
public class FileUploadController {

    private static final String UPLOADS_DIR = "../uploads";
    private static final String URL_PATH = "http://localhost/uploads/";

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@RestForm("file") FileUpload fileUpload) {
        if (fileUpload == null || fileUpload.fileName() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("No file was uploaded.").build();
        }

        try {
            File uploadsDir = new File(UPLOADS_DIR);
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }

            String uuidFileName = UUID.randomUUID().toString();
            String fileExt = fileUpload.fileName().substring(fileUpload.fileName().lastIndexOf('.'));
            String fileName = uuidFileName + fileExt;
            java.nio.file.Path targetPath = new File(uploadsDir, fileName).toPath();

            Files.copy(fileUpload.uploadedFile(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            // rw-r--r-- - Owner can read and write, others can only read
            Files.setPosixFilePermissions(targetPath, PosixFilePermissions.fromString("rw-r--r--"));

            String fileUrl = URL_PATH + fileName;
            return Response.ok("{\"url\": \"" + fileUrl + "\"}").build();
        } catch (IOException e) {
            return Response.serverError().entity("Failed to upload file.").build();
        }
    }
}
