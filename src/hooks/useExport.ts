import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Task } from '../models';

export function useExport() {
  const exportToExcel = async (tasks: Task[], filename = 'tasks.xlsx') => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Tasks');
    
    // Заголовки
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Assignee', key: 'assignee', width: 20 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Progress', key: 'progress', width: 15 }
    ];

    // Данные
    tasks.forEach(task => {
      worksheet.addRow({
        title: task.title,
        assignee: task.assignee,
        startDate: new Date(task.startDate).toLocaleDateString(),
        endDate: new Date(task.endDate).toLocaleDateString(),
        status: task.status,
        progress: `${task.progress}%`
      });
    });

    // Стили
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const exportToPDF = (tasks: Task[], filename = 'tasks.pdf') => {
    const doc = new jsPDF();
    
    doc.text('Task Report', 14, 16);
    
    (doc as any).autoTable({
      head: [['Title', 'Assignee', 'Start Date', 'End Date', 'Status', 'Progress']],
      body: tasks.map(task => [
        task.title,
        task.assignee || '-',
        new Date(task.startDate).toLocaleDateString(),
        new Date(task.endDate).toLocaleDateString(),
        task.status || '-',
        `${task.progress}%`
      ]),
      startY: 20,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [217, 217, 217],
        textColor: 0,
        fontStyle: 'bold'
      }
    });

    doc.save(filename);
  };

  return { exportToExcel, exportToPDF };
}