package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "fac_evidencias_averias")
public class EvidenciaAveria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "averia_id", nullable = false)
    private Long averiaId;

    @Column(name = "numero_foto", nullable = false)
    private Short numeroFoto;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    private String nombreArchivo;

    @Column(name = "ruta_archivo", length = 500)
    private String rutaArchivo;

    @Column(name = "tipo_mime", length = 100)
    private String tipoMime;

    @Column(name = "tamanio_bytes")
    private Long tamanioBytes;

    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "BYTEA")
    private byte[] contenido;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now(ZoneId.of("America/Lima"));

    @Column(name = "usuario_creacion")
    private Long usuarioCreacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAveriaId() { return averiaId; }
    public void setAveriaId(Long averiaId) { this.averiaId = averiaId; }

    public Short getNumeroFoto() { return numeroFoto; }
    public void setNumeroFoto(Short numeroFoto) { this.numeroFoto = numeroFoto; }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }

    public String getRutaArchivo() { return rutaArchivo; }
    public void setRutaArchivo(String rutaArchivo) { this.rutaArchivo = rutaArchivo; }

    public String getTipoMime() { return tipoMime; }
    public void setTipoMime(String tipoMime) { this.tipoMime = tipoMime; }

    public Long getTamanioBytes() { return tamanioBytes; }
    public void setTamanioBytes(Long tamanioBytes) { this.tamanioBytes = tamanioBytes; }

    public byte[] getContenido() { return contenido; }
    public void setContenido(byte[] contenido) { this.contenido = contenido; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }
}
