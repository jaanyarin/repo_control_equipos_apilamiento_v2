package com.apilamiento.control.controller;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class MarcaResourceTest {

    @Test
    void testListarEndpoint() {
        given()
                .when().get("/api/v1/marcas")
                .then()
                .statusCode(200);
    }

    @Test
    void testBuscarEndpointNoExistente() {
        given()
                .when().get("/api/v1/marcas/99999")
                .then()
                .statusCode(404);
    }
}
