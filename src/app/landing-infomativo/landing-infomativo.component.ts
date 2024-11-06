import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-infomativo',
  templateUrl: './landing-infomativo.component.html',
  styleUrls: ['./landing-infomativo.component.css']
})
export class LandingInfomativoComponent {
  isDarkMode = false;
  selectedLanguage: string = 'es'; // Español por defecto
  loading: boolean = false; // Variable para controlar la carga

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.translate.setDefaultLang(this.selectedLanguage);
  }

  ngOnInit(): void {
    console.log(`ngOnInit: Idioma por defecto establecido a: ${this.selectedLanguage}`);
    this.translate.use(this.selectedLanguage);
  }

  changeLanguage(event: any) {
    const lang = event.target.value;
    console.log(`changeLanguage: Cambiando idioma a: ${lang}`);

    this.translate.use(lang).subscribe({
      next: () => {
        console.log(`Idioma cambiado exitosamente a: ${lang}`);
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
      },
      error: (err) => console.error(`Error cambiando idioma: ${err}`)
    });
  }


  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.setAttribute(document.documentElement, 'data-bs-theme', 'dark');
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-bs-theme');
    }
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateToLogin() {
    this.loading = true; // Mostrar barra de carga
    setTimeout(() => {
      this.loading = false; // Ocultar barra de carga
      this.router.navigate(['/login']);
    }, 3000); // Retraso de 3 segundos antes de la redirección
  }

  
}
