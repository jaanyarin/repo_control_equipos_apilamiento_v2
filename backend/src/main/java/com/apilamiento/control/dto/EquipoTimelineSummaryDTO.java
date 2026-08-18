package com.apilamiento.control.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class EquipoTimelineSummaryDTO {
    private OffsetDateTime entryDate;
    private BigDecimal initialHourMeter;
    private BigDecimal finalHourMeter;
    private long failureCount;
    private long totalDowntimeMinutes;
    private OffsetDateTime finalDate;

    public OffsetDateTime getEntryDate() { return entryDate; }
    public void setEntryDate(OffsetDateTime entryDate) { this.entryDate = entryDate; }

    public BigDecimal getInitialHourMeter() { return initialHourMeter; }
    public void setInitialHourMeter(BigDecimal initialHourMeter) { this.initialHourMeter = initialHourMeter; }

    public BigDecimal getFinalHourMeter() { return finalHourMeter; }
    public void setFinalHourMeter(BigDecimal finalHourMeter) { this.finalHourMeter = finalHourMeter; }

    public long getFailureCount() { return failureCount; }
    public void setFailureCount(long failureCount) { this.failureCount = failureCount; }

    public long getTotalDowntimeMinutes() { return totalDowntimeMinutes; }
    public void setTotalDowntimeMinutes(long totalDowntimeMinutes) { this.totalDowntimeMinutes = totalDowntimeMinutes; }

    public OffsetDateTime getFinalDate() { return finalDate; }
    public void setFinalDate(OffsetDateTime finalDate) { this.finalDate = finalDate; }
}
