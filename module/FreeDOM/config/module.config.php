<?php
return array(
    'controllers' => array(
        'invokables' => array(
            'FreeDOM\Controller\FreeDOM' => 'FreeDOM\Controller\FreeDOMController',
        ),
    ),
    
    'router' => array(
        'routes' => array(
            'freedom' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/freedom[/:action][/:id]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    )#,
                    #'defaults' => array(
                    #    'controller' => 'FreeDOM\Controller\FreeDOM',
                    #    'action'     => 'index',
                    #),
                ),
            ),
        ),
    ),

    'view_manager' => array(
        'template_map' => array(
            'layout/json'           => __DIR__ . '/../view/ajax/layoutJson.phtml'
        ),
        'template_path_stack' => array(
            'free-dom' => __DIR__ . '/../view',
        ),
    ),
);