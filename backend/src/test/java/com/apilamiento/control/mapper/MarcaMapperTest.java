package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.MarcaDTO;
import com.apilamiento.control.entity.Marca;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MarcaMapperTest {

    private final MarcaMapper mapper = new MarcaMapper();

    @Test
    void toDTO_deberiaMapearTodosLosCampos() {
        Marca entity = new Marca();
        entity.setId(1L);
        entity.setNombre("Toyota");
        entity.setCodigo("TOYOTA");
        entity.setEstadoActivo(true);

        MarcaDTO dto = mapper.toDTO(entity);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Toyota", dto.getNombre());
        assertEquals("TOYOTA", dto.getCodigo());
        assertTrue(dto.getEstadoActivo());
    }

    @Test
    void toDTO_cuandoEntityEsNull_deberiaRetornarNull() {
        assertNull(mapper.toDTO(null));
    }
}
