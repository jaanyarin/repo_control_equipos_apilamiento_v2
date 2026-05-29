package com.apilamiento.control.dto;

import java.time.OffsetDateTime;

public class UsuarioDTO {
    private Long id;
    private String idMicrosoft;
    private String correo;
    private String nombre;
    private String puesto;
    private String area;
    private String empresa;
    private String departamento;
    private String ubicacion;
    private Long rolId;
    private String rolNombre;
    private Long sitioId;
    private OffsetDateTime ultimoAcceso;
    private Boolean estadoActivo;
    private Long usuarioCreacion;
    private Long usuarioActualizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;
    private OffsetDateTime fechaBaja;

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
    public String getRolNombre() { return rolNombre; }
    public void setRolNombre(String rolNombre) { this.rolNombre = rolNombre; }
    public Long getSitioId() { return sitioId; }
    public void setSitioId(Long sitioId) { this.sitioId = sitioId; }
    public OffsetDateTime getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(OffsetDateTime ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }
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
    public OffsetDateTime getFechaBaja() { return fechaBaja; }
    public void setFechaBaja(OffsetDateTime fechaBaja) { this.fechaBaja = fechaBaja; }
}
