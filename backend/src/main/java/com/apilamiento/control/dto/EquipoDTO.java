package com.apilamiento.control.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class EquipoDTO {
    private Long id;
    private Long proveedorId;
    private Long marcaId;
    private Long tipoEquipoId;
    private String modelo;
    private String codigo;
    private String numeroSerie;
    private String capacidad;
    private String alturaMaxima;
    private Boolean bateria;
    private String serieBateria;
    private Boolean bateriaAdicional;
    private String serieBateriaAdicional;
    private Boolean cargador;
    private String serieCargador;
    private Boolean transformador;
    private String serieTransformador;
    private Boolean extintor;
    private Boolean conoSeguridad;
    private Boolean botiquin;
    private Boolean mesaRodillos;
    private Boolean elevadorBateria;
    private Boolean cableAdicional;
    private Boolean conectorAdicional;
    private BigDecimal horometroInicio;
    private BigDecimal horometroFin;
    private String estadoOperativo;
    private String observaciones;
    private Boolean estadoActivo;
    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProveedorId() { return proveedorId; }
    public void setProveedorId(Long proveedorId) { this.proveedorId = proveedorId; }

    public Long getMarcaId() { return marcaId; }
    public void setMarcaId(Long marcaId) { this.marcaId = marcaId; }

    public Long getTipoEquipoId() { return tipoEquipoId; }
    public void setTipoEquipoId(Long tipoEquipoId) { this.tipoEquipoId = tipoEquipoId; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }

    public String getCapacidad() { return capacidad; }
    public void setCapacidad(String capacidad) { this.capacidad = capacidad; }

    public String getAlturaMaxima() { return alturaMaxima; }
    public void setAlturaMaxima(String alturaMaxima) { this.alturaMaxima = alturaMaxima; }

    public Boolean getBateria() { return bateria; }
    public void setBateria(Boolean bateria) { this.bateria = bateria; }

    public String getSerieBateria() { return serieBateria; }
    public void setSerieBateria(String serieBateria) { this.serieBateria = serieBateria; }

    public Boolean getBateriaAdicional() { return bateriaAdicional; }
    public void setBateriaAdicional(Boolean bateriaAdicional) { this.bateriaAdicional = bateriaAdicional; }

    public String getSerieBateriaAdicional() { return serieBateriaAdicional; }
    public void setSerieBateriaAdicional(String serieBateriaAdicional) { this.serieBateriaAdicional = serieBateriaAdicional; }

    public Boolean getCargador() { return cargador; }
    public void setCargador(Boolean cargador) { this.cargador = cargador; }

    public String getSerieCargador() { return serieCargador; }
    public void setSerieCargador(String serieCargador) { this.serieCargador = serieCargador; }

    public Boolean getTransformador() { return transformador; }
    public void setTransformador(Boolean transformador) { this.transformador = transformador; }

    public String getSerieTransformador() { return serieTransformador; }
    public void setSerieTransformador(String serieTransformador) { this.serieTransformador = serieTransformador; }

    public Boolean getExtintor() { return extintor; }
    public void setExtintor(Boolean extintor) { this.extintor = extintor; }

    public Boolean getConoSeguridad() { return conoSeguridad; }
    public void setConoSeguridad(Boolean conoSeguridad) { this.conoSeguridad = conoSeguridad; }

    public Boolean getBotiquin() { return botiquin; }
    public void setBotiquin(Boolean botiquin) { this.botiquin = botiquin; }

    public Boolean getMesaRodillos() { return mesaRodillos; }
    public void setMesaRodillos(Boolean mesaRodillos) { this.mesaRodillos = mesaRodillos; }

    public Boolean getElevadorBateria() { return elevadorBateria; }
    public void setElevadorBateria(Boolean elevadorBateria) { this.elevadorBateria = elevadorBateria; }

    public Boolean getCableAdicional() { return cableAdicional; }
    public void setCableAdicional(Boolean cableAdicional) { this.cableAdicional = cableAdicional; }

    public Boolean getConectorAdicional() { return conectorAdicional; }
    public void setConectorAdicional(Boolean conectorAdicional) { this.conectorAdicional = conectorAdicional; }

    public BigDecimal getHorometroInicio() { return horometroInicio; }
    public void setHorometroInicio(BigDecimal horometroInicio) { this.horometroInicio = horometroInicio; }

    public BigDecimal getHorometroFin() { return horometroFin; }
    public void setHorometroFin(BigDecimal horometroFin) { this.horometroFin = horometroFin; }

    public String getEstadoOperativo() { return estadoOperativo; }
    public void setEstadoOperativo(String estadoOperativo) { this.estadoOperativo = estadoOperativo; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Boolean getEstadoActivo() { return estadoActivo; }
    public void setEstadoActivo(Boolean estadoActivo) { this.estadoActivo = estadoActivo; }

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
