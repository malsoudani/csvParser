<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CSVController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function csvHandler(Request $request)
    {
        dd($request->csv);
    }
}
