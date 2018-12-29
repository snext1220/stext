<?php
$scenarios = [];
$utils = [];
$futures = [];

$stext = simplexml_load_file('stext2.xml');
foreach($stext->scenario->work as $work) {
	if ($work['id']) {
		$scenarios[(string)$work['id']] = [
			'level' => (string)$work['level'],
			'published' => (string)$work['published']
		];
	} else {
		$futures[] = [
			'title' => (string)$work['title'],
			'author' => (string)$work['author'],
			'published' => (string)$work['published']
		];
	}
}
foreach($stext->utility->work as $util) {
	$utils[] = [
		'title' => (string)$util['title'],
		'author' => (string)$util['author'],
		'text' => (string)$util
	];
}
//print_r($scenarios);
/*
$scenarios = [
	'scepter',
	'zero',
	'doll',
	'tempest',
	'hero',
	'vampire',
	'slayer',
	'ramidia',
	'cat',
	'soul',
	'kenshin',
	'fortune',
	'inn',
	'begin',
	'shadow',
	'traitor',
];
$except = ['.', '..', 'common', 'playground', 'trial', 'test'];
*/
$r_scenarios = [];
foreach($scenarios as $id => $value) {
	$data = [];
	$path = $id.'/scenario.xml';
	$xml = simplexml_load_file($path);
	$intro = $xml->init->intro;
	$data['id'] = $id;
	$data['title'] = (string)$xml['title'];
	$data['author'] = (string)$xml['author'];
	$data['series'] = (string)$intro['series'];
	$data['extra1'] = (string)$intro['extra1'];
	$data['extra2'] = (string)$intro['extra2'];
	$data['tags'] = (string)$intro['tags'];
	$data['published'] = date('Y年m月d日', strtotime($value['published']));
	$data['updated'] = date('Y年m月d日', filemtime($path));
	$data['level'] = (string)$value['level'];
	$data['comment'] = (string)$intro['comment'];
	$data['text'] = (string)$intro;
	$data['scenes'] = $xml->scene->count();
	$data['results'] = count($xml->results->result);
	$r_scenarios[] = $data;
}


$result = [
	'scenario' => $r_scenarios,
	'utility' => $utils,
	'future' => $futures
];
print_r($result);
//print(json_encode($result));