package com.apilamiento.control.service;

import com.apilamiento.control.entity.*;
import com.apilamiento.control.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import jakarta.enterprise.context.ApplicationScoped;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@ApplicationScoped
public class ReporteService {

    private static final ZoneId ZONE = ZoneId.of("America/Lima");
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Color PRIMARY = new Color(25, 118, 210);
    private static final Color HEADER_BG = new Color(25, 118, 210);
    private static final Color ROW_ALT = new Color(245, 245, 245);
    private static final Color BORDER = new Color(200, 200, 200);

    private final EquipoRepository equipoRepository;
    private final OsrRepository osrRepository;
    private final PsrRepository psrRepository;
    private final AveriaRepository averiaRepository;
    private final ProveedorRepository proveedorRepository;
    private final MarcaRepository marcaRepository;
    private final SedeRepository sedeRepository;
    private final CampanaRepository campanaRepository;
    private final MotivoPsrRepository motivoPsrRepository;
    private final EvidenciaIngresoEquipoRepository evidenciaIngresoRepository;
    private final EvidenciaAveriaRepository evidenciaAveriaRepository;
    private final EvidenciaDevolucionEquipoRepository evidenciaDevolucionRepository;

    public ReporteService(EquipoRepository equipoRepository, OsrRepository osrRepository,
            PsrRepository psrRepository, AveriaRepository averiaRepository,
            ProveedorRepository proveedorRepository, MarcaRepository marcaRepository,
            SedeRepository sedeRepository, CampanaRepository campanaRepository,
            MotivoPsrRepository motivoPsrRepository,
            EvidenciaIngresoEquipoRepository evidenciaIngresoRepository,
            EvidenciaAveriaRepository evidenciaAveriaRepository,
            EvidenciaDevolucionEquipoRepository evidenciaDevolucionRepository) {
        this.equipoRepository = equipoRepository;
        this.osrRepository = osrRepository;
        this.psrRepository = psrRepository;
        this.averiaRepository = averiaRepository;
        this.proveedorRepository = proveedorRepository;
        this.marcaRepository = marcaRepository;
        this.sedeRepository = sedeRepository;
        this.campanaRepository = campanaRepository;
        this.motivoPsrRepository = motivoPsrRepository;
        this.evidenciaIngresoRepository = evidenciaIngresoRepository;
        this.evidenciaAveriaRepository = evidenciaAveriaRepository;
        this.evidenciaDevolucionRepository = evidenciaDevolucionRepository;
    }

    public byte[] generarPdf(Long equipoId) {
        Equipo equipo = equipoRepository.findByIdOptional(equipoId)
                .orElseThrow(() -> new jakarta.ws.rs.WebApplicationException("Equipo no encontrado",
                        jakarta.ws.rs.core.Response.Status.NOT_FOUND));

        Osr osr = osrRepository.findByEquipoId(equipoId).orElse(null);
        Psr psr = osr != null ? psrRepository.findByIdOptional(osr.getPsrId()).orElse(null) : null;
        Proveedor proveedor = equipo.getProveedorId() != null
                ? proveedorRepository.findByIdOptional(equipo.getProveedorId()).orElse(null) : null;
        Marca marca = equipo.getMarcaId() != null
                ? marcaRepository.findByIdOptional(equipo.getMarcaId()).orElse(null) : null;
        Sede sede = psr != null && psr.getSedeId() != null
                ? sedeRepository.findByIdOptional(psr.getSedeId()).orElse(null) : null;
        Campana campana = psr != null && psr.getCampanaId() != null
                ? campanaRepository.findByIdOptional(psr.getCampanaId()).orElse(null) : null;
        MotivoPsr motivo = psr != null && psr.getMotivoId() != null
                ? motivoPsrRepository.findByIdOptional(psr.getMotivoId()).orElse(null) : null;
        List<Averia> averias = averiaRepository.listByEquipoId(equipoId);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 36, 36, 50, 36);
        PdfWriter writer = PdfWriter.getInstance(doc, out);
        doc.open();

        String numeroPsr = psr != null ? psr.getNumeroPsr() : "-";
        String numeroOsr = osr != null ? osr.getNumeroOsr() : "-";
        String grr = equipo.getNumeroGuiaRemision() != null ? equipo.getNumeroGuiaRemision() : "-";

        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);
        PdfPCell brandCell = new PdfPCell(new Phrase("VANGUARD", new Font(Font.HELVETICA, 18, Font.BOLD, PRIMARY)));
        brandCell.setBorder(Rectangle.BOTTOM);
        brandCell.setBorderColor(PRIMARY);
        brandCell.setBorderWidth(3);
        brandCell.setPaddingBottom(8);
        headerTable.addCell(brandCell);
        doc.add(headerTable);
        doc.add(new Paragraph(" "));

        String title = "Reporte Detallado de Equipo";
        String subtitle = "PSR: " + numeroPsr + "  |  OSR: " + numeroOsr + "  |  GRR: " + grr;
        Paragraph titleP = new Paragraph(title, new Font(Font.HELVETICA, 16, Font.BOLD));
        titleP.setAlignment(Element.ALIGN_CENTER);
        doc.add(titleP);
        Paragraph subtitleP = new Paragraph(subtitle, new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY));
        subtitleP.setAlignment(Element.ALIGN_CENTER);
        subtitleP.setSpacingAfter(12);
        doc.add(subtitleP);

        addSectionTitle(doc, "Información general");
        PdfPTable generalTbl = createInfoTable();
        addRow(generalTbl, "Proveedor", proveedor != null ? proveedor.getRazonSocial() : "-");
        addRow(generalTbl, "Marca", marca != null ? marca.getNombre() : "-");
        addRow(generalTbl, "Modelo", equipo.getModelo());
        addRow(generalTbl, "Código", equipo.getCodigo());
        addRow(generalTbl, "Nro Serie", equipo.getNumeroSerie());
        addRow(generalTbl, "Guía Remisión", grr);
        doc.add(generalTbl);
        doc.add(new Paragraph(" "));

        addSectionTitle(doc, "Información de accesorios");
        PdfPTable accTbl = createInfoTable();
        addRow(accTbl, "Batería", accBool(equipo.getBateria()) + (equipo.getSerieBateria() != null ? " (" + equipo.getSerieBateria() + ")" : ""));
        addRow(accTbl, "Batería Adicional", accBool(equipo.getBateriaAdicional()) + (equipo.getSerieBateriaAdicional() != null ? " (" + equipo.getSerieBateriaAdicional() + ")" : ""));
        addRow(accTbl, "Cargador", accBool(equipo.getCargador()) + (equipo.getSerieCargador() != null ? " (" + equipo.getSerieCargador() + ")" : ""));
        addRow(accTbl, "Transformador", accBool(equipo.getTransformador()) + (equipo.getSerieTransformador() != null ? " (" + equipo.getSerieTransformador() + ")" : ""));
        addRow(accTbl, "Extintor", accBool(equipo.getExtintor()));
        addRow(accTbl, "Cono de seguridad", accBool(equipo.getConoSeguridad()));
        addRow(accTbl, "Botiquín", accBool(equipo.getBotiquin()));
        addRow(accTbl, "Mesa de rodillos", accBool(equipo.getMesaRodillos()));
        addRow(accTbl, "Elevador de batería", accBool(equipo.getElevadorBateria()));
        addRow(accTbl, "Cable adicional", accBool(equipo.getCableAdicional()));
        addRow(accTbl, "Conector adicional", accBool(equipo.getConectorAdicional()));
        doc.add(accTbl);
        doc.add(new Paragraph(" "));

        addSectionTitle(doc, "Información del servicio");
        PdfPTable svcTbl = createInfoTable();
        addRow(svcTbl, "PSR asociada", numeroPsr);
        addRow(svcTbl, "OSR asociada", numeroOsr);
        addRow(svcTbl, "Campaña", campana != null ? campana.getNombre() : "-");
        addRow(svcTbl, "Sede", sede != null ? sede.getNombre() : "-");
        addRow(svcTbl, "Motivo", motivo != null ? motivo.getNombre() : "-");
        addRow(svcTbl, "Fecha PSR", psr != null ? formatDate(psr.getFechaPsr()) : "-");
        addRow(svcTbl, "Fecha Inicio de Servicio", psr != null ? formatDate(psr.getFechaInicioUso()) : "-");
        addRow(svcTbl, "Fecha Final de Servicio", psr != null ? formatDate(psr.getFechaFinUso()) : "-");
        addRow(svcTbl, "Tiempo de Servicio", psr != null ? calcularMeses(psr.getFechaInicioUso(), psr.getFechaFinUso()) : "-");
        addRow(svcTbl, "Fecha Ingreso de Máquina", formatDate(equipo.getFechaIngreso()));
        addRow(svcTbl, "Fecha Devolución de Máquina", formatDate(equipo.getFechaDevolucion()));
        addRow(svcTbl, "Tiempo de Uso de Máquina", calcularMeses(equipo.getFechaIngreso(), equipo.getFechaDevolucion()));
        addRow(svcTbl, "Horómetro Inicial", formatNum(equipo.getHorometroInicio()));
        addRow(svcTbl, "Horómetro Final", formatNum(equipo.getHorometroFin()));
        addRow(svcTbl, "Total Horómetro", totalHorometro(equipo.getHorometroInicio(), equipo.getHorometroFin()));
        doc.add(svcTbl);
        doc.add(new Paragraph(" "));

        addSectionTitle(doc, "Información de averías");
        if (averias.isEmpty()) {
            Paragraph empty = new Paragraph("Sin averías registradas", new Font(Font.HELVETICA, 10, Font.ITALIC, Color.GRAY));
            empty.setSpacingBefore(4);
            doc.add(empty);
        } else {
            PdfPTable avgTbl = new PdfPTable(6);
            avgTbl.setWidthPercentage(100);
            avgTbl.setWidths(new float[]{25, 13, 12, 13, 12, 15});
            addTableHeader(avgTbl, new String[]{"Descripción de la Falla", "Fecha Inicio", "Horómetro (avería)", "Fecha Reparación", "Horómetro (reparación)", "Tiempo de paro"});
            for (Averia a : averias) {
                avgTbl.addCell(cellText(a.getDescripcionFalla()));
                avgTbl.addCell(cellText(formatDate(a.getFechaHoraAveria())));
                avgTbl.addCell(cellText(formatNum(a.getHorometro())));
                avgTbl.addCell(cellText(formatDate(a.getFechaHoraAtencion())));
                avgTbl.addCell(cellText(formatNum(a.getHorometroAtencion())));
                avgTbl.addCell(cellText(calcularDowntime(a)));
            }
            doc.add(avgTbl);
        }

        doc.newPage();

        String page2Title = "Reporte Fotográfico de Equipo";
        PdfPTable header2 = new PdfPTable(1);
        header2.setWidthPercentage(100);
        PdfPCell brand2 = new PdfPCell(new Phrase("VANGUARD", new Font(Font.HELVETICA, 18, Font.BOLD, PRIMARY)));
        brand2.setBorder(Rectangle.BOTTOM);
        brand2.setBorderColor(PRIMARY);
        brand2.setBorderWidth(3);
        brand2.setPaddingBottom(8);
        header2.addCell(brand2);
        doc.add(header2);
        doc.add(new Paragraph(" "));
        Paragraph t2 = new Paragraph(page2Title, new Font(Font.HELVETICA, 16, Font.BOLD));
        t2.setAlignment(Element.ALIGN_CENTER);
        doc.add(t2);
        Paragraph sub2 = new Paragraph(equipo.getCodigo() + " · " + equipo.getModelo(),
                new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY));
        sub2.setAlignment(Element.ALIGN_CENTER);
        sub2.setSpacingAfter(12);
        doc.add(sub2);

        addIngresoPhotoSection(doc, "Fotografías del equipo recepcionado",
                evidenciaIngresoRepository.listByEquipo(equipoId));
        addIngresoPhotoSection(doc, "Fotografías de accesorios",
                evidenciaIngresoRepository.listByEquipo(equipoId).stream()
                        .filter(e -> isAccesorioType(e.getTipo().name())).toList());
        addDevolucionPhotoSection(doc, "Fotografías del equipo entregado",
                evidenciaDevolucionRepository.listByEquipo(equipoId));

        doc.close();
        return out.toByteArray();
    }

    private void addIngresoPhotoSection(Document doc, String title, List<EvidenciaIngresoEquipo> fotos) {
        addPhotoSectionGeneric(doc, title, fotos.stream().map(e -> (PhotoData) () -> {
            try { return e.getContenido(); } catch (Exception ex) { return null; }
        }).toList(), fotos.stream().map(e -> e.getTipo().name().replace("_", " ")).toList());
    }

    private void addDevolucionPhotoSection(Document doc, String title, List<EvidenciaDevolucionEquipo> fotos) {
        addPhotoSectionGeneric(doc, title, fotos.stream().map(e -> (PhotoData) () -> {
            try { return e.getContenido(); } catch (Exception ex) { return null; }
        }).toList(), fotos.stream().map(e -> e.getTipo().name().replace("_", " ")).toList());
    }

    private void addPhotoSectionGeneric(Document doc, String title, List<PhotoData> photos, List<String> labels) {
        addSectionTitle(doc, title);
        if (photos.isEmpty()) {
            Paragraph empty = new Paragraph("Sin fotografías registradas.",
                    new Font(Font.HELVETICA, 10, Font.ITALIC, Color.GRAY));
            empty.setSpacingBefore(4);
            doc.add(empty);
            return;
        }
        float photoWidth = 170;
        float photoHeight = 130;
        PdfPTable grid = new PdfPTable(3);
        grid.setWidthPercentage(100);
        for (int i = 0; i < photos.size(); i++) {
            byte[] bytes = photos.get(i).bytes();
            if (bytes == null || bytes.length == 0) continue;
            try {
                Image img = Image.getInstance(bytes);
                img.scaleToFit(photoWidth, photoHeight);
                img.setAlignment(Element.ALIGN_CENTER);
                PdfPCell imgCell = new PdfPCell(img, true);
                imgCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                imgCell.setBorderColor(BORDER);
                imgCell.setPadding(4);
                String label = i < labels.size() ? labels.get(i) : "Evidencia";
                PdfPCell capCell = new PdfPCell(new Phrase(label,
                        new Font(Font.HELVETICA, 8, Font.NORMAL, Color.GRAY)));
                capCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                capCell.setBorderColor(BORDER);
                capCell.setPadding(2);
                PdfPTable inner = new PdfPTable(1);
                inner.addCell(imgCell);
                inner.addCell(capCell);
                PdfPCell wrapper = new PdfPCell(inner);
                wrapper.setBorder(Rectangle.BOX);
                wrapper.setBorderColor(BORDER);
                wrapper.setPadding(2);
                grid.addCell(wrapper);
            } catch (Exception e) {
                grid.addCell(cellText("Error cargando imagen"));
            }
        }
        int remaining = 3 - (photos.size() % 3);
        if (remaining < 3) {
            for (int i = 0; i < remaining; i++) {
                grid.addCell(cellText(""));
            }
        }
        try { doc.add(grid); } catch (DocumentException e) { /* ignore */ }
    }

    @FunctionalInterface
    interface PhotoData {
        byte[] bytes();
    }

    private boolean isAccesorioType(String tipo) {
        return tipo.contains("BATERIA") || tipo.contains("EXTINTOR") || tipo.contains("CARGADOR")
                || tipo.contains("TRANSFORMADOR") || tipo.contains("CABLE") || tipo.contains("CONECTOR")
                || tipo.contains("MESA") || tipo.contains("ELEVADOR") || tipo.contains("CONO")
                || tipo.contains("BOTIQUIN");
    }

    private void addSectionTitle(Document doc, String title) throws DocumentException {
        PdfPTable tbl = new PdfPTable(1);
        tbl.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase(title,
                new Font(Font.HELVETICA, 11, Font.BOLD, Color.WHITE)));
        cell.setBackgroundColor(HEADER_BG);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5);
        cell.setBorder(Rectangle.NO_BORDER);
        tbl.addCell(cell);
        tbl.setSpacingAfter(4);
        tbl.setSpacingBefore(8);
        doc.add(tbl);
    }

    private PdfPTable createInfoTable() {
        PdfPTable tbl = new PdfPTable(2);
        tbl.setWidthPercentage(100);
        tbl.setWidths(new float[]{35, 65});
        return tbl;
    }

    private void addRow(PdfPTable tbl, String label, String value) {
        PdfPCell lbl = new PdfPCell(new Phrase(label != null ? label : "-",
                new Font(Font.HELVETICA, 9, Font.BOLD)));
        lbl.setBorderColor(BORDER);
        lbl.setPadding(4);
        PdfPCell val = new PdfPCell(new Phrase(value != null ? value : "-",
                new Font(Font.HELVETICA, 9)));
        val.setBorderColor(BORDER);
        val.setPadding(4);
        tbl.addCell(lbl);
        tbl.addCell(val);
    }

    private void addTableHeader(PdfPTable tbl, String[] headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h,
                    new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE)));
            cell.setBackgroundColor(PRIMARY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(4);
            cell.setBorderColor(PRIMARY);
            tbl.addCell(cell);
        }
    }

    private PdfPCell cellText(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "-",
                new Font(Font.HELVETICA, 8)));
        cell.setBorderColor(BORDER);
        cell.setPadding(3);
        return cell;
    }

    private String formatDate(LocalDateTime ldt) {
        return ldt != null ? ldt.format(FMT) : "-";
    }

    private String formatDate(OffsetDateTime odt) {
        return odt != null ? odt.toLocalDateTime().format(FMT) : "-";
    }

    private String formatNum(BigDecimal val) {
        return val != null ? val.toPlainString() : "-";
    }

    private String accBool(Boolean val) {
        return Boolean.TRUE.equals(val) ? "Sí" : "No";
    }

    private String calcularMeses(LocalDateTime inicio, OffsetDateTime fin) {
        if (inicio == null || fin == null) return "-";
        long days = ChronoUnit.DAYS.between(inicio, fin.toLocalDateTime());
        if (days <= 0) return "-";
        return String.format("%.2f meses", days / 30.44);
    }

    private String calcularMeses(LocalDateTime inicio, LocalDateTime fin) {
        if (inicio == null || fin == null) return "-";
        long days = ChronoUnit.DAYS.between(inicio, fin);
        if (days <= 0) return "-";
        return String.format("%.2f meses", days / 30.44);
    }

    private String totalHorometro(BigDecimal ini, BigDecimal fin) {
        if (ini == null || fin == null) return "-";
        BigDecimal total = fin.subtract(ini);
        return total.compareTo(BigDecimal.ZERO) >= 0 ? total.toPlainString() : "-";
    }

    private String calcularDowntime(Averia a) {
        if (a.getFechaHoraAveria() == null || a.getFechaHoraAtencion() == null) return "-";
        long min = ChronoUnit.MINUTES.between(a.getFechaHoraAveria(), a.getFechaHoraAtencion());
        if (min <= 0) return "-";
        return String.format("%.1f días", min / 1440.0);
    }
}
