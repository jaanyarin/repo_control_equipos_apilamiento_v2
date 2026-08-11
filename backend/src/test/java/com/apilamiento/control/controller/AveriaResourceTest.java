package com.apilamiento.control.controller;

import com.apilamiento.control.dto.AveriaDTO;
import com.apilamiento.control.service.AveriaService;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AveriaResourceTest {

    @Mock
    AveriaService service;

    @Mock
    SecurityContext securityContext;

    @Mock
    JsonWebToken jwt;

    private AveriaResource resource() {
        return new AveriaResource(service);
    }

    private void simularToken(Long usuarioId) {
        when(securityContext.getUserPrincipal()).thenReturn(jwt);
        when(jwt.getSubject()).thenReturn(String.valueOf(usuarioId));
    }

    @Test
    void crear_deberiaAsignarUsuarioDelTokenComoUsuarioCreacion() {
        simularToken(17L);
        when(service.crear(any())).thenReturn(new AveriaDTO());

        AveriaDTO dto = new AveriaDTO();
        dto.setEquipoId(1L);
        dto.setDescripcionFalla("Falla de prueba");

        resource().crear(dto, securityContext);

        ArgumentCaptor<AveriaDTO> captor = ArgumentCaptor.forClass(AveriaDTO.class);
        verify(service).crear(captor.capture());
        assertEquals(17L, captor.getValue().getUsuarioCreacion());
    }

    @Test
    void actualizar_deberiaAsignarUsuarioDelTokenComoUsuarioActualizacion() {
        simularToken(17L);
        when(service.actualizar(any(), any())).thenReturn(new AveriaDTO());

        AveriaDTO dto = new AveriaDTO();
        dto.setEquipoId(1L);
        dto.setDescripcionFalla("Falla de prueba");

        resource().actualizar(1L, dto, securityContext);

        ArgumentCaptor<AveriaDTO> captor = ArgumentCaptor.forClass(AveriaDTO.class);
        verify(service).actualizar(any(), captor.capture());
        assertEquals(17L, captor.getValue().getUsuarioActualizacion());
    }

    @Test
    void crear_sinToken_deberiaDejarUsuarioCreacionNulo() {
        when(securityContext.getUserPrincipal()).thenReturn(null);
        when(service.crear(any())).thenReturn(new AveriaDTO());

        AveriaDTO dto = new AveriaDTO();
        dto.setEquipoId(1L);
        dto.setDescripcionFalla("Falla de prueba");

        resource().crear(dto, securityContext);

        ArgumentCaptor<AveriaDTO> captor = ArgumentCaptor.forClass(AveriaDTO.class);
        verify(service).crear(captor.capture());
        assertEquals(null, captor.getValue().getUsuarioCreacion());
    }
}
