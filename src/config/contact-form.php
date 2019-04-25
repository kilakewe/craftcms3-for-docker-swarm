<?php

$config = [];
$request = Craft::$app->request;
$config['allowAttachments'] = true;

if (
    !$request->getIsConsoleRequest() &&
    ($toEmail = $request->getValidatedBodyParam('toEmail')) !== null
) {
    $config['toEmail'] = $toEmail;
}

return $config;