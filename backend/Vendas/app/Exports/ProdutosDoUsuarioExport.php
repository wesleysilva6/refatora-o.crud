<?php

namespace App\Exports;

use App\Models\Produto;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProdutosDoUsuarioExport
{
    public function download(?string $filename = null): StreamedResponse
    {
        $itens = Produto::with('topico')
            ->where('usuario_id', Auth::id())
            ->orderBy('topico_id')
            ->orderBy('id', 'desc')
            ->get();

        $ss = new Spreadsheet();
        $sheet = $ss->getActiveSheet();

        // Cabeçalhos
        $sheet->fromArray(
            ['Tópico', 'Produto', 'Preço', 'Quantidade', 'Descrição', 'Criado em', 'Atualizado em'],
            null,
            'A1'
        );

        // Linhas
        $r = 2;
        foreach ($itens as $p) {
            $sheet->setCellValue("A{$r}", optional($p->topico)->nome_topico);
            $sheet->setCellValue("B{$r}", $p->nome_produto);
            $sheet->setCellValue("C{$r}", (float) $p->preco);
            $sheet->setCellValue("D{$r}", (int) $p->quantidade);
            $sheet->setCellValue("E{$r}", $p->descricao);
            $sheet->setCellValue("F{$r}", optional($p->created_at)?->timezone('America/Sao_Paulo')->format('d/m/Y H:i'));
            $sheet->setCellValue("G{$r}", optional($p->updated_at)?->timezone('America/Sao_Paulo')->format('d/m/Y H:i'));
            $r++;
        }

        // Formatação
        $last = $r - 1;
        $sheet->getStyle("C2:C{$last}")->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_00);
        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($ss);
        $filename = $filename ?: 'estoque_usuario_' . now()->format('Ymd_His') . '.xlsx';

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
