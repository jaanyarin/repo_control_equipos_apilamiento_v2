package com.apilamiento.control.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "dim_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_microsoft", nullable = false, unique = true, length = 255)
    private String idMicrosoft;

    @Column(nullable = false, unique = true, length = 255)
    private String correo;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(length = 255)
    private String puesto;

    @Column(length = 255)
    private String area;

    @Column(length = 255)
    private String empresa;

    @Column(length = 255)
    private String departamento;

    @Column(length = 255)
    private String ubicacion;

    @Column(name = "rol_id", nullable = false)
    private Long rolId;

    @Column(name = "sitio_id")
    private Long sitioId;

    @Column(name = "ultimo_acceso")
    private OffsetDateTime ultimoAcceso;

    @Column(name = "estado_activo", nullable = false)
    private Boolean estadoActivo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now(ZoneId.of("America/Lima"));

    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    @Column(name = "fecha_baja")
    private OffsetDateTime fechaBaja;

    @Column(name = "usuario_creacion", nullable = false)
    private Long usuarioCreacion;

    @Column(name = "usuario_actualizacion")
    private Long usuarioActualizacion;

    @Version
    private Integer version = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", insertable = false, updatable = false)
    private Rol rol;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIdMicrosoft() { return idMicrosoft; }
    public void setIdMicrosoft(String idMicrosoft) { this.idMicrosoft = idMicrosoft; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPuesto() { return puesto; }
    public void setPuesto(String puesto) { this.puesto = puesto; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public Long getRolId() { return rolId; }
    public void setRolId(Long rolId) { this.rolId = rolId; }
    public Long getSitioId() { return sitioId; }
    public void setSitioId(Long sitioId) { this.sitioId = sitioId; }
    public OffsetDateTime getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(OffsetDateTime ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }
    public Boolean getEstadoActivo() { return estadoActivo; }
    public void setEstadoActivo(Boolean estadoActivo) { this.estadoActivo = estadoActivo; }
    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    public OffsetDateTime getFechaBaja() { return fechaBaja; }
    public void setFechaBaja(OffsetDateTime fechaBaja) { this.fechaBaja = fechaBaja; }
    public Long getUsuarioCreacion() { return usuarioCreacion; }
    public void setUsuarioCreacion(Long usuarioCreacion) { this.usuarioCreacion = usuarioCreacion; }
    public Long getUsuarioActualizacion() { return usuarioActualizacion; }
    public void setUsuarioActualizacion(Long usuarioActualizacion) { this.usuarioActualizacion = usuarioActualizacion; }
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}
