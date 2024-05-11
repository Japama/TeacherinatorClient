import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server'; // Importar ReactDOMServer
import { Schedule } from './Schedule';
import { ScheduleHour } from './ScheduleHour';
import PDFComponent from '../templates/PDFComponent';
import { CenterScheduleHour } from './CenterScheduleHour';
import { Group } from '../groups/Group';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// In a .d.ts file in your project
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
}

// You'll also need to define the type for the options parameter. 
// This is a simplified example, you might need to add more properties depending on your usage of autoTable.
interface AutoTableOptions {
  html: string;
  // Add other options as needed
}


interface ScheduleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  username: String | undefined;
  group: Group | undefined;
  scheduleHours: ScheduleHour[];
  centerScheduleHours: CenterScheduleHour[];
}

const ScheduleDetails = ({ isOpen, onClose, schedule, username, group, scheduleHours, centerScheduleHours }: ScheduleDetailsProps) => {
  const formatTime = (timeArray: number[]): string => {
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = "Horario de " + (group ? getGroupText(group) : username)
    doc.text(title, 10, 10);
    // Configura las opciones de autoTable
    const options = {
        theme: 'grid', // 'striped', 'grid' or 'plain'
        styles: {
            font: 'courier',
            fontStyle: 'bold',
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontSize: 11,
            tableLineColor: 200, // Color de la línea de la tabla
            tableLineWidth: 0.5, // Ancho de la línea de la tabla
            // cellPadding: 1, // Relleno de la celda
            cellWidth: 'auto', // 'auto', 'wrap' or a number, 
            minCellHeight: 0.5, // Altura mínima de la celda
            valign: 'middle', // Alineación vertical: 'top', 'center', 'bottom'
            halign: 'center', // Alineación horizontal: 'left', 'center', 'right'
            lineColor: [59, 130, 246],
            lineWidth: 1 // If 0, no border is drawn
        }, // Color de fondo de las celdas
        columnStyles: {
            0: {
                fillColor: [59, 130, 246],
                textColor: [255, 255, 255],
            }
        },
        margin: { top: 10 }, // Margen superior
        startY: 25, // Posición vertical inicial de la tabla
        tableWidth: 'auto', // Ancho de la tabla
        html: '#horario' // ID de la tabla HTML
    };
    doc.autoTable(options);

    doc.save('Horario.pdf');
};

  // Organize scheduleHours by n_hour and then by weekday
  const hourWeekdayHours: { [key: number]: ScheduleHour[] } = {};

  scheduleHours.forEach(hour => {
    if (!hourWeekdayHours[hour.n_hour]) {
      hourWeekdayHours[hour.n_hour] = [];
    }
    // Push the hour object into the array corresponding to its n_hour
    hourWeekdayHours[hour.n_hour].push(hour);
  });

  const allHours = centerScheduleHours.length > 0
    ? Array.from({ length: centerScheduleHours[centerScheduleHours.length - 1].n_hour }, (_, i) => i)
    : [];

  const maxNHour = centerScheduleHours.length > 0 ? centerScheduleHours[centerScheduleHours.length - 1].n_hour : 0;

  // Add or remove the 'no-scroll' class to the body when isOpen changes
  useEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen);
  }, [isOpen]);


  const getGroupText = (group: Group) => {
    const stageTexts = ['ESO', 'Bachiller', 'DAM'];
    return `${group.course}º ${stageTexts[group.stage - 1]} ${group.letter} de ${schedule.course}`;
  };


  return (
    isOpen ? (
      <div className="modal flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-content rounded-lg w-full mx-auto lg:w-4/5 drop-shadow-2xl bg-white p-8 " style={{ position: 'relative' }}>
          <h2 className="backdrop-blur-md text-4xl pb-8 text-center text-blue-600">{`Horario de ${group ? getGroupText(group) : username}`}</h2>
          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            <table id="horario" className="table-fixed w-full text-center border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  {/* <th className="border border-blue-500 px-4 py-2" colSpan={6}>Hora</th> */}
                  {['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(day => (
                    <th key={day} className="border border-blue-500 px-4 py-2">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allHours.map(n_hour => (
                  <tr key={n_hour}>
                    {['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, index) => {
                      const hour = hourWeekdayHours[n_hour] && hourWeekdayHours[n_hour][index - 1];
                      return (
                        <React.Fragment key={n_hour + '_' + index}>
                          {index === 0 && (
                            <td className=" bg-blue-500 border border-blue-500 px-4 py-2 text-white">
                              {`${formatTime(centerScheduleHours[n_hour * maxNHour].start_time)}`}
                              <br></br>
                              {`${formatTime(centerScheduleHours[n_hour * maxNHour].end_time)}`}
                            </td>
                          )} {index > 0 && (
                            <td className="border border-blue-500 px-4 py-2 ">
                              {hour ? `${hour.subject_name} ` : ' '}
                              <br></br>
                              {hour ? `(${hour.classroom_name}) ` : ' '}
                            </td>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={downloadPDF} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Descargar PDF</button>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Cerrar</button>
        </div>
      </div>


    ) : null
  );
};

export default ScheduleDetails;
