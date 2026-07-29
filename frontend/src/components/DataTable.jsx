import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

export default function DataTable({
  columns, data = [], actions, renderCard,
  loading, error, onReload,
  title, emptyMessage = 'No hay registros',
  getRowStyle,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Alert severity="error" sx={{ m: 0 }}>{error}</Alert>

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        {emptyMessage}
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.map((row, i) => {
          if (renderCard) return <Box key={row.id || i}>{renderCard(row)}</Box>
          return (
            <Card key={row.id || i} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {columns.map((col) => (
                  <Box key={col.field} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 80 }}>
                      {col.label}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>
                      {col.render ? col.render(row) : row[col.field] ?? '-'}
                    </Typography>
                  </Box>
                ))}
                {actions && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    {actions(row)}
                  </Box>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field} sx={{ fontWeight: 600, ...(col.sx || {}) }}>
                {col.label}
              </TableCell>
            ))}
            {actions && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={row.id || i}
              hover
              sx={getRowStyle ? getRowStyle(row) : {}}
            >
              {columns.map((col) => (
                <TableCell key={col.field} sx={col.cellSx || {}}>
                  {col.render ? col.render(row) : row[col.field] ?? '-'}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {actions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
