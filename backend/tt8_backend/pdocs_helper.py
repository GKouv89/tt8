import os
import django
import pdoc
from pathlib import Path
# 1️⃣ Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tt8_backend.settings")
django.setup()

biosignals = Path('biosignalsindex')
output_dir = Path('pdocs')

# 2️⃣ Call pdoc CLI programmatically
pdoc.pdoc(biosignals, output_directory=output_dir)
