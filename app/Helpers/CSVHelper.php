<?php namespace App\Helpers;

use Carbon\Carbon;

class CSVHelper
{
    public function AnalysisResponse($request)
    {
        $csvCollect = $this->csvToCollection($request->csv);
        $noDupeCollect = $csvCollect->sortBy('trans_date')->unique(function ($item) {
            return $item->cust_fname.$item->cust_email;
        });
        $respArr = [];
        foreach ($noDupeCollect as $collect) {
            $collect->delivery_status = 'Not Sent';
            $collect->delivery_method = $collect->invite = $collect->message = '';
            $collect = $this->withinLastWeek($collect);
            $collect = $this->textOrEmail($collect);
            $collect = $this->sendInvite($collect);
        }
        $dupeCollect = $this->handleDupes($csvCollect, $noDupeCollect);
        return json_encode($dupeCollect->merge($noDupeCollect)->sortKeys());
    }

    public function csvToCollection($csv)
    {
        $fileObj = fopen($csv, 'r');
        $counter = 0;
        $csvArr = $keys = [];
        while ($file = fgetcsv($fileObj)) {
            if ($counter == 0) {
                $counter++;
                $keys = $file;
                continue;
            }
            $csvArr[] = (object) array_combine($keys, $file);
        }
        return collect($csvArr);
    }

    public function withinLastWeek($collect)
    {
        $weekAgo = Carbon::createFromFormat('Y-m-d', '2018-03-05')->subWeek();
        $transTime = Carbon::createFromFormat('Y-m-d H:i:s', trim($collect->trans_date) . " " . trim($collect->trans_time));
        if ($transTime < $weekAgo) {
            $collect->message = "this is sooo old" . PHP_EOL;
        }
        return $collect;
    }

    public function textOrEmail($collect)
    {
        if (strpos($collect->message, "sooo old")) {
            return $collect;
        }
        if (strlen(str_replace('-', "", (trim($collect->cust_phone)))) == 10) {
            $collect->delivery_method = 'text';
            return $collect;
        }
        if (!empty(trim($collect->cust_phone))) {
            $collect->message .= 'Invalid phone entered' . PHP_EOL;
        }
        if (filter_var($collect->cust_email, FILTER_VALIDATE_EMAIL)) {
            $collect->delivery_method = 'email';
            return $collect;
        }
        if (!empty(trim($collect->cust_email))) {
            $collect->message .= 'Invaild Email entered' . PHP_EOL;
        }
        if (empty(trim($collect->cust_email)) && empty(trim($collect->cust_phone))) {
            $collect->message .= 'no contact info provided';
        }
        return $collect;
    }

    public function sendInvite($collect)
    {
        if (strpos($collect->message, "sooo old")) {
            return $collect;
        }
        if ($collect->delivery_method == 'email' || $collect->delivery_method == 'text') {
            $collect->message .= 'Success' . PHP_EOL; // normally here I'd put a mailable.
            $collect->delivery_status = 'Sent!! Yeeehaaa';
            $collect->invite = $collect->trans_type;
        }
        return $collect;
    }

    public function handleDupes($fullObj, $noDupeObj)
    {
        $diffObj = $fullObj->diffKeys($noDupeObj);
        foreach ($diffObj as $obj) {
            $obj->delivery_status = 'Not Sent';
            $obj->delivery_method = $obj->invite = '';
            $obj->message = 'This is a Duplicate';
        }
        return $diffObj;
    }
}
