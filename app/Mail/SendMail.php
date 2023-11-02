<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;


    public array $details;
    public string $viewName;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(array $details, string $viewName)
    {
        $this->details = $details;
        $this->viewName = $viewName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('funny.stack1@gmail.com', 'Funny Stack')->subject($this->details["subject"])->view($this->viewName)->with('details', $this->details);
    }
}
