package com.apilamiento.control.service;

import com.apilamiento.control.dto.EquipoDTO;
import com.apilamiento.control.entity.Equipo;
import com.apilamiento.control.mapper.EquipoMapper;
import com.apilamiento.control.repository.CampanaRepository;
import com.apilamiento.control.repository.EquipoRepository;
import com.apilamiento.control.repository.MarcaRepository;
import com.apilamiento.control.repository.OsrRepository;
import com.apilamiento.control.repository.ProveedorRepository;
import com.apilamiento.control.repository.PsrRepository;
import com.apilamiento.control.repository.SedeRepository;
import com.apilamiento.control.repository.TipoEquipoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EquipoServiceTest {

    @Mock
    EquipoRepository repository;
    @Mock ProveedorRepository proveedorRepository;
    @Mock MarcaRepository marcaRepository;
    @Mock TipoEquipoRepository tipoEquipoRepository;
    @Mock OsrRepository osrRepository;
    @Mock PsrRepository psrRepository;
    @Mock SedeRepository sedeRepository;
    @Mock CampanaRepository campanaRepository;

    EquipoMapper mapper = new EquipoMapper();

    EquipoService service;

    @BeforeEach
    void setUp() {
        service = new EquipoService(repository, mapper, proveedorRepository, marcaRepository,
                tipoEquipoRepository, osrRepository, psrRepository, sedeRepository, campanaRepository);
    }

    @Test
    void listarTodos_deberiaRetornarLista() {
        when(repository.listCompletos()).thenReturn(List.of(new Equipo()));

        List<EquipoDTO> resultado = service.listarTodos();

        assertNotNull(resultado);
    }

    @Test
    void buscarPorId_cuandoExiste_deberiaRetornarDTO() {
        Equipo equipo = new Equipo();
        equipo.setId(1L);
        when(repository.findByIdOptional(1L)).thenReturn(Optional.of(equipo));

        EquipoDTO resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void buscarPorId_cuandoNoExiste_deberiaRetornarNull() {
        when(repository.findByIdOptional(99L)).thenReturn(Optional.empty());

        EquipoDTO resultado = service.buscarPorId(99L);

        assertNull(resultado);
    }
}
