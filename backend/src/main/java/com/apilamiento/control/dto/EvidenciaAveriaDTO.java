package com.apilamiento.control.dto;

import java.time.OffsetDateTime;

public class EvidenciaAveriaDTO {
    private Long id;
    private Long averiaId;
    private Short numeroFoto;
    private String nombreArchivo;
    private String tipoMime;
    private Long tamanioBytes;
    private OffsetDateTime fechaCreacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAveriaId() { return averiaId; }
    public void setAveriaId(Long averiaId) { this.averiaId = averiaId; }
    public Short getNumeroFoto() { return numeroFoto; }
    public void setNumeroFoto(Short numeroFoto) { this.numeroFoto = numeroFoto; }
    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }
    public String getTipoMime() { return tipoMime; }
    public void setTipoMime(String tipoMime) { this.tipoMime = tipoMime; }
    public Long getTamanioBytes() { return tamanioBytes; }
    public void setTamanioBytes(Long tamanioBytes) { this.tamanioBytes = tamanioBytes; }
    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
