package com.apilamiento.control.dto;

import java.util.List;

public class EquipoTimelineDTO {
    private Long equipmentId;
    private String currentStatus;
    private EquipoTimelineSummaryDTO summary;
    private List<EquipoTimelineEventDTO> events;

    public Long getEquipmentId() { return equipmentId; }
    public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public EquipoTimelineSummaryDTO getSummary() { return summary; }
    public void setSummary(EquipoTimelineSummaryDTO summary) { this.summary = summary; }

    public List<EquipoTimelineEventDTO> getEvents() { return events; }
    public void setEvents(List<EquipoTimelineEventDTO> events) { this.events = events; }
}
