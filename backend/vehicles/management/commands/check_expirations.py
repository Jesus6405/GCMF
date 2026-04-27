from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from vehicles.models import Document, LegalNotification

class Command(BaseCommand):
    help = 'Revisa los documentos legales que vencen en 15 días o menos y genera notificaciones'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        # Calculamos la fecha límite 
        threshold_date = today + timedelta(days=15)

        # Buscamos documentos que expiren entre hoy y los próximos 15 días
        expiring_docs = Document.objects.filter(
            date_end__lte=threshold_date,
            date_end__gte=today
        )

        count = 0
        for doc in expiring_docs:
            days_left = (doc.date_end - today).days

            # Solo creamos la notificación si no existe una activa para este documento
            if not LegalNotification.objects.filter(document=doc, is_read=False).exists():
                LegalNotification.objects.create(
                    message=f"Alerta: {doc.document_type} de {doc.vehicle.placa} vence en {days_left} días.",
                    notif_type='LEGAL',
                    document=doc
                )
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Notificación creada para: {doc.id_policy}'))

        self.stdout.write(self.style.SUCCESS(f'Proceso completado. Se generaron {count} alertas nuevas.'))