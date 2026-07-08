package com.apilamiento.control.exception;

public class EntidadNoEncontradaException extends RuntimeException {
    private final String entidad;
    private final Long id;

    public EntidadNoEncontradaException(String entidad, Long id) {
        super(entidad + " con id " + id + " no encontrado");
        this.entidad = entidad;
        this.id = id;
    }

    public String getEntidad() { return entidad; }
    public Long getId() { return id; }
}
