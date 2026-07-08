package com.apilamiento.control.service;

import com.apilamiento.control.audit.AuditoriaEvento;
import com.apilamiento.control.audit.AuditoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditoriaServiceTest {

    @Mock
    AuditoriaRepository repository;

    AuditoriaService service;

    @BeforeEach
    void setUp() {
        service = new AuditoriaService(repository);
    }

    @Test
    void registrar_deberiaPersistirEvento() {
        service.registrar("LOGIN", "Usuario", 1L, "INICIAR_SESION",
                1L, "Admin", "Inicio de sesion exitoso", "192.168.1.1");

        verify(repository).persist(any(AuditoriaEvento.class));
    }

    @Test
    void listarRecientes_deberiaRetornarLista() {
        AuditoriaEvento evento = new AuditoriaEvento();
        evento.setId(1L);
        evento.setTipoEvento("LOGIN");
        evento.setFechaEvento(OffsetDateTime.now());
        when(repository.listarRecientes(10)).thenReturn(List.of(evento));

        List<AuditoriaEvento> resultado = service.listarRecientes(10);

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }
}
