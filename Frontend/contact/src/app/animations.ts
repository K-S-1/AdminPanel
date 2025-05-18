import { trigger, transition, style, query, animate, group } from '@angular/animations';
export const routeAnimation = trigger('routeAnimation', [
    transition('* <=> *', [ // Animate between any two routes
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            })
        ], { optional: true }),
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }) // Start state for entering element
        ], { optional: true }),
        group([ // Animate leave and enter simultaneously
            query(':leave', [
                animate('400ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' })) // End state for leaving element
            ], { optional: true }),
            query(':enter', [
                animate('500ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // End state for entering element (with slight delay)
            ], { optional: true })
        ])
    ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideInLeft = trigger('slideInLeft', [
    transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
    ])
]);

 export const slideInUp = trigger('slideInUp', [
    transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ])
]);