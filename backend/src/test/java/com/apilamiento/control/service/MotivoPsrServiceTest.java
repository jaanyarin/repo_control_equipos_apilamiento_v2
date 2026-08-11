package com.apilamiento.control.service;

import com.apilamiento.control.dto.MotivoPsrDTO;
import com.apilamiento.control.entity.MotivoPsr;
import com.apilamiento.control.entity.TipoEquipo;
import com.apilamiento.control.mapper.MotivoPsrMapper;
import com.apilamiento.control.repository.MotivoPsrRepository;
import com.apilamiento.control.repository.TipoEquipoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MotivoPsrServiceTest {

    @Mock
    MotivoPsrRepository repository;

    @Mock
    TipoEquipoRepository tipoEquipoRepository;

    MotivoPsrMapper mapper = new MotivoPsrMapper();

    MotivoPsrService service;

    @BeforeEach
    void setUp() {
        service = new MotivoPsrService(repository, mapper, tipoEquipoRepository);
    }

    private void simularPersist() {
        doAnswer(invocation -> {
            MotivoPsr e = invocation.getArgument(0);
            e.setId(7L);
            return null;
        }).when(repository).persist(any(MotivoPsr.class));
    }

    @Test
    void crear_soloConNombre_deberiaDerivarNombreCortoYCodigo() {
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Daño por manipulación");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("Daño por manipulación", resultado.getNombre());
        assertEquals("Daño por manipulación", resultado.getNombreCorto());
        assertNotNull(resultado.getCodigo());
        assertFalse(resultado.getCodigo().isBlank());
        verify(repository).persist(any(MotivoPsr.class));
    }

    @Test
    void crear_conNombreCorto_deberiaUsarElProporcionado() {
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Falla de motor");
        dto.setNombreCorto("FALLA");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("FALLA", resultado.getNombreCorto());
    }

    @Test
    void crear_nombreCortoVacio_deberiaDerivarDelNombre() {
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Falla de motor");
        dto.setNombreCorto("   ");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("Falla de motor", resultado.getNombreCorto());
    }

    @Test
    void crear_conNombreCortoNuevo_deberiaCrearTipoEquipo() {
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Falla eléctrica");
        dto.setNombreCorto("FALLA");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("FALLA", resultado.getNombreCorto());
        ArgumentCaptor<TipoEquipo> captor = ArgumentCaptor.forClass(TipoEquipo.class);
        verify(tipoEquipoRepository).persist(captor.capture());
        TipoEquipo tipo = captor.getValue();
        assertEquals("FALLA", tipo.getNombre());
        assertNotNull(tipo.getCodigo());
        assertTrue(tipo.getCodigo().startsWith("FALLA"));
    }

    @Test
    void crear_conNombreCortoExistente_deberiaReutilizarTipoEquipo() {
        TipoEquipo existente = new TipoEquipo();
        existente.setId(9L);
        existente.setNombre("FALLA");
        existente.setCodigo("FALLA");
        when(tipoEquipoRepository.findByNombre("FALLA")).thenReturn(Optional.of(existente));
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Falla eléctrica");
        dto.setNombreCorto("FALLA");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        verify(tipoEquipoRepository).findByNombre("FALLA");
        verify(tipoEquipoRepository, never()).persist(any(TipoEquipo.class));
    }

    @Test
    void crear_nombreCortoVacio_deberiaDerivarYCrearTipoEquipo() {
        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Falla de motor");
        dto.setNombreCorto("   ");
        simularPersist();

        MotivoPsrDTO resultado = service.crear(dto);

        assertNotNull(resultado);
        assertEquals("Falla de motor", resultado.getNombreCorto());
        verify(tipoEquipoRepository).findByNombre("Falla de motor");
        verify(tipoEquipoRepository).persist(any(TipoEquipo.class));
    }

    @Test
    void actualizar_sinNombreCorto_deberiaPreservarElExistente() {
        MotivoPsr entity = new MotivoPsr();
        entity.setId(1L);
        entity.setNombre("Original");
        entity.setNombreCorto("Orig");
        when(repository.findById(1L)).thenReturn(entity);

        MotivoPsrDTO dto = new MotivoPsrDTO();
        dto.setNombre("Actualizado");

        MotivoPsrDTO resultado = service.actualizar(1L, dto);

        assertNotNull(resultado);
        assertEquals("Actualizado", resultado.getNombre());
        assertEquals("Orig", resultado.getNombreCorto());
        verify(repository, never()).persist(any(MotivoPsr.class));
    }
}
