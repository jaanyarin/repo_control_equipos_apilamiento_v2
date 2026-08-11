package com.apilamiento.control.service;

import com.apilamiento.control.dto.ProveedorDTO;
import com.apilamiento.control.entity.Proveedor;
import com.apilamiento.control.mapper.ProveedorMapper;
import com.apilamiento.control.repository.ProveedorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProveedorServiceTest {

    @Mock
    ProveedorRepository repository;

    ProveedorMapper mapper = new ProveedorMapper();

    ProveedorService service;

    @BeforeEach
    void setUp() {
        service = new ProveedorService(repository, mapper);
    }

    private void simularPersist() {
        doAnswer(invocation -> {
            Proveedor e = invocation.getArgument(0);
            e.setId(5L);
            return null;
        }).when(repository).persist(any(Proveedor.class));
    }

    @Test
    void crear_soloConRazonSocial_deberiaDerivarCodigoSinRuc() {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setRazonSocial("Distribuidora Andina");
        simularPersist();

        ProveedorDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("Distribuidora Andina", resultado.getRazonSocial());
        assertEquals("DISTRIBUIDORA_ANDINA", resultado.getCodigo());
        assertNull(resultado.getRuc());
        verify(repository).persist(any(Proveedor.class));
    }

    @Test
    void crear_conRuc_deberiaGuardarRuc() {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setRazonSocial("Distribuidora Andina");
        dto.setRuc("20123456789");
        simularPersist();

        ProveedorDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("20123456789", resultado.getRuc());
        assertEquals("DISTRIBUIDORA_ANDINA", resultado.getCodigo());
    }

    @Test
    void actualizar_sinRuc_deberiaPreservarElExistente() {
        Proveedor entity = new Proveedor();
        entity.setId(1L);
        entity.setRazonSocial("Viejo");
        entity.setCodigo("VIEJO");
        entity.setRuc("20123456789");
        when(repository.findById(1L)).thenReturn(entity);

        ProveedorDTO dto = new ProveedorDTO();
        dto.setRazonSocial("Nuevo");

        ProveedorDTO resultado = service.actualizar(1L, dto);

        assertNotNull(resultado);
        assertEquals("Nuevo", resultado.getRazonSocial());
        assertEquals("NUEVO", resultado.getCodigo());
        assertEquals("20123456789", resultado.getRuc());
        verify(repository, never()).persist(any(Proveedor.class));
    }
}
