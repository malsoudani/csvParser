<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;
use Carbon\Carbon;
use App\Helpers\CSVHelper;

class CSVController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function csvHandler(Request $request)
    {
        $csv = new CSVHelper;
        dd($csv->AnalysisResponse($request));
    }


}
