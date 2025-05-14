import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Task, Dependency } from '../models';

const API_BASE_URL = '/api/export';

export const exportToExcel = async (
  tasks: Task[],
  dependencies: Dependency[] = [],
  fileName: string = 'tasks_export.xlsx'
): Promise<void> => {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Tasks');

    // Заголовки столбцов
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Progress', key: 'progress', width: 15 },
      { header: 'Assignee', key: 'assignee', width: 20 }
    ];

    // Данные
    tasks.forEach(task => {
      worksheet.addRow({
        title: task.title,
        startDate: new Date(task.startDate).toLocaleDateString(),
        endDate: new Date(task.endDate).toLocaleDateString(),
        status: task.status,
        progress: task.progress,
        assignee: task.assignee || '-'
      });
    });

    // Стили для заголовков
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0070C0' }
      };
    });

    // Лист с зависимостями
    if (dependencies.length > 0) {
      const depsWorksheet = workbook.addWorksheet('Dependencies');
      depsWorksheet.columns = [
        { header: 'From Task', key: 'fromTask', width: 30 },
        { header: 'To Task', key: 'toTask', width: 30 },
        { header: 'Type', key: 'type', width: 15 }
      ];

      dependencies.forEach(dep => {
        const fromTask = tasks.find(t => t.id === dep.fromTaskId);
        const toTask = tasks.find(t => t.id === dep.toTaskId);
        depsWorksheet.addRow({
          fromTask: fromTask?.title || dep.fromTaskId,
          toTask: toTask?.title || dep.toTaskId,
          type: dep.type
        });
      });
    }

    // Генерация файла
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
  } catch (error) {
    console.error('Excel export failed:', error);
    throw error;
  }
};

export const exportToPDF = (
  tasks: Task[],
  dependencies: Dependency[] = [],
  fileName: string = 'tasks_export.pdf'
): void => {
  try {
    const doc = new jsPDF();
    const title = 'Tasks Report';
    const headers = [['Title', 'Start Date', 'End Date', 'Status', 'Progress', 'Assignee']];
    
    const data = tasks.map(task => [
      task.title,
      new Date(task.startDate).toLocaleDateString(),
      new Date(task.endDate).toLocaleDateString(),
      task.status || '-',
      `${task.progress}%`,
      task.assignee || '-'
    ]);

    // Основная таблица задач
    doc.text(title, 14, 16);
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [32, 112, 192],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    // Таблица зависимостей (если есть)
    if (dependencies.length > 0) {
      doc.addPage();
      doc.text('Task Dependencies', 14, 16);
      
      const depsHeaders = [['From Task', 'To Task', 'Type']];
      const depsData = dependencies.map(dep => {
        const fromTask = tasks.find(t => t.id === dep.fromTaskId);
        const toTask = tasks.find(t => t.id === dep.toTaskId);
        return [
          fromTask?.title || dep.fromTaskId,
          toTask?.title || dep.toTaskId,
          dep.type
        ];
      });

      (doc as any).autoTable({
        head: depsHeaders,
        body: depsData,
        startY: 20,
        styles: {
          cellPadding: 3,
          fontSize: 9
        },
        headStyles: {
          fillColor: [32, 112, 192],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
    }

    doc.save(fileName);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export const exportToServer = async (
  tasks: Task[],
  format: 'excel' | 'pdf'
): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/${format}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tasks })
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.blob();
};