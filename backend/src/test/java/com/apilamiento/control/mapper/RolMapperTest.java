package com.apilamiento.control.mapper;

import com.apilamiento.control.dto.RolDTO;
import com.apilamiento.control.entity.Rol;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RolMapperTest {

    private final RolMapper mapper = new RolMapper();

    @Test
    void toDTO_deberiaMapearTodosLosCampos() {
        Rol entity = new Rol();
        entity.setId(1L);
        entity.setNombre("Admin");
        entity.setDescripcion("Administrador del sistema");
        entity.setEstadoActivo(true);

        RolDTO dto = mapper.toDTO(entity);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Admin", dto.getNombre());
        assertEquals("Administrador del sistema", dto.getDescripcion());
        assertTrue(dto.getEstadoActivo());
    }

    @Test
    void toDTO_cuandoEntityEsNull_deberiaRetornarNull() {
        assertNull(mapper.toDTO(null));
    }
}
