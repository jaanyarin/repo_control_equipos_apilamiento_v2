package com.apilamiento.control.dto;

import java.math.BigDecimal;

public class EquipoTimelineMetadataDTO {
    private String documentNumber;
    private String provider;
    private String area;
    private String campana;
    private BigDecimal costPerMonth;
    private String currency;
    private String failure;
    private String action;
    private Long downtimeMinutes;
    private String userName;
    private BigDecimal hourMeter;

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getCampana() { return campana; }
    public void setCampana(String campana) { this.campana = campana; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public BigDecimal getCostPerMonth() { return costPerMonth; }
    public void setCostPerMonth(BigDecimal costPerMonth) { this.costPerMonth = costPerMonth; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getFailure() { return failure; }
    public void setFailure(String failure) { this.failure = failure; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Long getDowntimeMinutes() { return downtimeMinutes; }
    public void setDowntimeMinutes(Long downtimeMinutes) { this.downtimeMinutes = downtimeMinutes; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public BigDecimal getHourMeter() { return hourMeter; }
    public void setHourMeter(BigDecimal hourMeter) { this.hourMeter = hourMeter; }
}
