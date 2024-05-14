import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server'; // Importar ReactDOMServer
import { Schedule } from './Schedule';
import { ScheduleHour } from './ScheduleHour';
import PDFComponent from '../templates/PDFComponent';
import { CenterScheduleHour } from '../centerSchedules/CenterScheduleHour';
import { Group } from '../groups/Group';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ScheduleHourForm from './ScheduleHourForm';
import { isCallChain } from 'typescript';

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
  isModalEditHourOpen: boolean;
  schedule: Schedule;
  scheduleHours: ScheduleHour[];
  centerScheduleHours: CenterScheduleHour[];
  onEditScheduleHour: (scheduleHour: ScheduleHour) => void;
  onDelete: (scheduleHour: ScheduleHour) => void;
  onClose: () => void;
  onCloseEdit: () => void;
}

const ScheduleDetails = ({ isOpen, isModalEditHourOpen, schedule, scheduleHours, centerScheduleHours, onClose, onCloseEdit, onEditScheduleHour, onDelete }: ScheduleDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [scheduleHourEdited, setScheduleHourEdited] = useState<ScheduleHour | null>(null);

  const handleEdit = (hour: ScheduleHour) => {
    setScheduleHourEdited(hour);
    setIsCreate(false);
    setIsModalEditOpen(true);
  };

  const handleCreate = (n_hour: number, week_day: number) => {
    const newScheduleHour = new ScheduleHour({ ...scheduleHourEdited, id: undefined, classroom_name: "", subject_name: "", week_day: week_day, n_hour: n_hour, schedule_id: schedule.id });
    setScheduleHourEdited(newScheduleHour);
    setIsCreate(false);
    setIsModalEditOpen(true);
  };

  const closeModal = () => {
    // setIsModalOpen(false);
    // setGroupBeingEdited(null);
    setIsModalEditOpen(false);
  };

  const formatTime = (timeArray: number[]): string => {
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = "Horario de " + (schedule.group ? getGroupText(schedule.group) : schedule.user?.username)
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
      <>
        {isModalEditOpen && (
          <ScheduleHourForm
            isOpen={isModalEditOpen}
            isCreate={isCreate}
            onCloseEdit={closeModal}
            onEdit={onEditScheduleHour}
            onDelete={onDelete}
            scheduleHour={scheduleHourEdited ? scheduleHourEdited : new ScheduleHour()}
          />
        )}


        <div className="modal flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-content rounded-lg w-full mx-auto lg:w-4/5 drop-shadow-2xl bg-white p-8 " style={{ position: 'relative' }}>
            <h2 className="backdrop-blur-md text-4xl pb-8 text-center text-blue-600">{`Horario de ${schedule.group ? getGroupText(schedule.group) : schedule.user?.username}`}</h2>
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              <table id="horario" className="table-fixed w-full text-center border-collapse">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    {['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(day => (
                      <th key={day} className="border border-blue-500 px-4 py-2">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {centerScheduleHours.map(schdulehour => (
                    <tr key={schdulehour.n_hour}>
                      {['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, index) => {
                        const hour = scheduleHours.find(hour => hour.week_day === index - 1 && hour.n_hour === schdulehour.n_hour);
                        return (
                          <React.Fragment key={schdulehour.n_hour + '_' + index}>
                            {index === 0 ? (
                              <td className=" bg-blue-500 border border-blue-500 px-4 py-2 text-white">
                                {`${formatTime(centerScheduleHours[schdulehour.n_hour].start_time)}`}
                                <br></br>
                                {`${formatTime(centerScheduleHours[schdulehour.n_hour].end_time)}`}
                              </td>
                            ) : index > 0 && hour ? (
                              <td className="border border-blue-500 px-4 py-2  " onClick={() => handleEdit(hour)}>
                                {`${hour.subject_name} `}
                                <br></br>
                                {`(${hour.classroom_name}) `}
                              </td>
                            ) :
                              // <td className="px-6 py-4 text-center" onClick={() => onEdit(hour ? hour : new ScheduleHour())} >➕</td>}
                              <td className="px-6 py-4 text-center" onClick={() => handleCreate(schdulehour.n_hour, index - 1)} >➕</td>
                            }
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
      </>


    ) : null
  );
};

export default ScheduleDetails;
