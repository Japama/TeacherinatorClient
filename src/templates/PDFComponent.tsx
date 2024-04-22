import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Schedule } from '../schedules/Schedule';
import { ScheduleHour } from '../schedules/ScheduleHour';

interface Props {
    schedule: Schedule;
    allHours: number[];
    hourWeekdayHours: { [key: number]: ScheduleHour[] }; // Cambiar este tipo
    formatTime: (time: number[]) => string; // Ajustar el tipo de la función formatTime si es necesario
  }
  
// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 30,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      textDecoration: 'underline',
    },
    table: {
      // display: 'table',
      width: 'auto',
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
    },
    cellHeader: {
      padding: 5,
      backgroundColor: '#0077cc',
      color: '#ffffff',
    },
    cell: {
      padding: 5,
    },
  });
  
  // Componente del PDF
  const PDFComponent: React.FC<Props> = ({ schedule, allHours, hourWeekdayHours, formatTime }) => {
    // Constante para los días de la semana
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>{`Horario de ${schedule.course}`}</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cellHeader, styles.cell]}>Hora</Text>
              {daysOfWeek.map(day => (
                <Text key={day} style={[styles.cellHeader, styles.cell]}>{day}</Text>
              ))}
            </View>
            {allHours.map(n_hour => (
              <View key={n_hour} style={styles.row}>
                {daysOfWeek.map((day, index) => {
                  const hour = hourWeekdayHours[n_hour] && hourWeekdayHours[n_hour][index];
                  return (
                    <React.Fragment key={index}>
                      {index === 0 && (
                        <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                          {hour ? `${formatTime(hour.start_time)} - ${formatTime(hour.end_time)}` : ' '}
                        </Text>
                      )}
                      <Text style={styles.cell}>
                        {hour ? `${hour.subject_name} (${hour.classroom_name})` : ' '}
                      </Text>
                    </React.Fragment>
                  );
                })}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };
  
  export default PDFComponent;