package com.apilamiento.control.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class EquipoTimelineEventDTO {
    private String id;
    private Long equipmentId;
    private String type;
    private OffsetDateTime dateTime;
    private String title;
    private String description;
    private String status;
    private EquipoTimelineMetadataDTO metadata;
    private List<EquipoTimelinePhotoDTO> photos;
    private Long relatedId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getEquipmentId() { return equipmentId; }
    public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public OffsetDateTime getDateTime() { return dateTime; }
    public void setDateTime(OffsetDateTime dateTime) { this.dateTime = dateTime; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public EquipoTimelineMetadataDTO getMetadata() { return metadata; }
    public void setMetadata(EquipoTimelineMetadataDTO metadata) { this.metadata = metadata; }

    public List<EquipoTimelinePhotoDTO> getPhotos() { return photos; }
    public void setPhotos(List<EquipoTimelinePhotoDTO> photos) { this.photos = photos; }

    public Long getRelatedId() { return relatedId; }
    public void setRelatedId(Long relatedId) { this.relatedId = relatedId; }
}
