<?php

namespace App\Exports;

use App\Models\Produto;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProdutosDoTopicoExport
{
    public function __construct(protected int $topicoId) {}

    public function download(?string $filename = null): StreamedResponse
    {
        $itens = Produto::where('topico_id', $this->topicoId)
            ->orderBy('id', 'desc')
            ->get();

        $ss = new Spreadsheet();
        $sheet = $ss->getActiveSheet();

        // Cabeçalhos
        $sheet->fromArray(
            ['Produto', 'Preço', 'Quantidade', 'Descrição', 'Criado em', 'Atualizado em'],
            null,
            'A1'
        );

        // Linhas
        $r = 2;
        foreach ($itens as $p) {
            $sheet->setCellValue("A{$r}", $p->nome_produto);
            $sheet->setCellValue("B{$r}", (float) $p->preco);
            $sheet->setCellValue("C{$r}", (int) $p->quantidade);
            $sheet->setCellValue("D{$r}", $p->descricao);
            $sheet->setCellValue("E{$r}", optional($p->created_at)?->timezone('America/Sao_Paulo')->format('d/m/Y H:i'));
            $sheet->setCellValue("F{$r}", optional($p->updated_at)?->timezone('America/Sao_Paulo')->format('d/m/Y H:i'));
            $r++;
        }

        // Formatação
        $last = $r - 1;
        $sheet->getStyle("B2:B{$last}")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_00);
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($ss);
        $filename = $filename ?: 'topico_' . $this->topicoId . '_' . now()->format('Ymd_His') . '.xlsx';

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control'       => 'max-age=0, no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
        ]);
    }
}
