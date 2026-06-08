package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "fac_equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "proveedor_id")
    private Long proveedorId;

    @Column(name = "marca_id")
    private Long marcaId;

    @Column(name = "tipo_equipo_id")
    private Long tipoEquipoId;

    @Column(nullable = false, length = 150)
    private String modelo;

    @Column(nullable = false, unique = true, length = 100)
    private String codigo;

    @Column(name = "numero_serie", nullable = false, unique = true, length = 150)
    private String numeroSerie;

    @Column(length = 50)
    private String capacidad;

    @Column(name = "altura_maxima", length = 50)
    private String alturaMaxima;

    @Column(nullable = false)
    private Boolean bateria = false;

    @Column(name = "serie_bateria", length = 150)
    private String serieBateria;

    @Column(name = "bateria_adicional", nullable = false)
    private Boolean bateriaAdicional = false;

    @Column(name = "serie_bateria_adicional", length = 150)
    private String serieBateriaAdicional;

    @Column(nullable = false)
    private Boolean cargador = false;

    @Column(name = "serie_cargador", length = 150)
    private String serieCargador;

    @Column(nullable = false)
    private Boolean transformador = false;

    @Column(name = "serie_transformador", length = 150)
    private String serieTransformador;

    @Column(nullable = false)
    private Boolean extintor = false;

    @Column(name = "cono_seguridad", nullable = false)
    private Boolean conoSeguridad = false;

    @Column(nullable = false)
    private Boolean botiquin = false;

    @Column(name = "mesa_rodillos", nullable = false)
    private Boolean mesaRodillos = false;

    @Column(name = "elevador_bateria", nullable = false)
    private Boolean elevadorBateria = false;

    @Column(name = "cable_adicional", nullable = false)
    private Boolean cableAdicional = false;

    @Column(name = "conector_adicional", nullable = false)
    private Boolean conectorAdicional = false;

    @Column(name = "horometro_inicio")
    private BigDecimal horometroInicio;

    @Column(name = "horometro_fin")
    private BigDecimal horometroFin;

    @Column(name = "estado_operativo", nullable = false, length = 30)
    private String estadoOperativo = "OPERATIVO";

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "estado_activo", nullable = false)
    private Boolean estadoActivo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now(ZoneId.of("America/Lima"));

    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    @Column(name = "usuario_creacion")
    private Long usuarioCreacion;

    @Column(name = "usuario_actualizacion")
    private Long usuarioActualizacion;

    @Version
    private Integer version = 0;

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

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }

    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
}
