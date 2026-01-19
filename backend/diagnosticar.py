"""
Script de diagnóstico corregido para verificar el estado del backend y la base de datos
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import SessionLocal
from app.models import User, Exercise, Cycle, Badge
import json

def diagnosticar():
    print("🔍 DIAGNÓSTICO DE LOGICQUEST")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # 1. Verificar conexión a la base de datos
        print("\n1️⃣ Verificando base de datos...")
        try:
            db.execute(text("SELECT 1"))
            print("  ✅ Conexión a BD exitosa")
        except Exception as e:
            print(f"  ❌ Error de conexión: {e}")
            return
        
        # 2. Verificar usuarios
        print("\n2️⃣ Verificando usuarios...")
        usuarios = db.query(User).all()
        print(f"  📊 Total usuarios: {len(usuarios)}")
        if usuarios:
            print("  👥 Usuarios encontrados:")
            for u in usuarios:
                print(f"     - {u.name}: {u.total_points} pts (ID: {u.id})")
        else:
            print("  ⚠️  No hay usuarios en la BD")
        
        # 3. Verificar ejercicios de condicionales
        print("\n3️⃣ Verificando ejercicios de condicionales...")
        ejercicios = db.query(Exercise).filter(Exercise.module == "condicionales").all()
        print(f"  📊 Total ejercicios: {len(ejercicios)}")
        if ejercicios:
            print("  📝 Primeros 3 ejercicios:")
            for ej in ejercicios[:3]:
                print(f"     - ID {ej.id}: {ej.statement[:50]}...")
                options = json.loads(ej.options_json)
                print(f"       Opciones: {options}")
                print(f"       Respuesta correcta: índice {ej.correct_index}")
        else:
            print("  ⚠️  No hay ejercicios en la BD")
        
        # 4. Verificar ciclos
        print("\n4️⃣ Verificando retos de ciclos...")
        ciclos = db.query(Cycle).all()
        print(f"  📊 Total ciclos: {len(ciclos)}")
        if ciclos:
            print("  🔄 Primeros 3 retos:")
            for c in ciclos[:3]:
                print(f"     - ID {c.id}: {c.title}")
                print(f"       Dificultad: {c.difficulty}, Puntos: {c.points}")
        else:
            print("  ⚠️  No hay retos en la BD")
        
        # 5. Verificar insignias
        print("\n5️⃣ Verificando insignias...")
        insignias = db.query(Badge).all()
        print(f"  📊 Total insignias: {len(insignias)}")
        if insignias:
            for b in insignias:
                print(f"     - {b.name} ({b.code}): {b.points} pts")
        else:
            print("  ⚠️  No hay insignias en la BD")
        
        # 6. Verificar ubicación de la BD
        print("\n6️⃣ Verificando archivos...")
        import os
        bd_path = os.path.join(os.getcwd(), "logicquest.db")
        if os.path.exists(bd_path):
            size = os.path.getsize(bd_path) / 1024  # KB
            print(f"  ✅ Base de datos encontrada: logicquest.db ({size:.2f} KB)")
        else:
            print(f"  ⚠️  No se encontró logicquest.db en {os.getcwd()}")
        
        # 7. Resumen
        print("\n" + "=" * 60)
        print("📊 RESUMEN DEL DIAGNÓSTICO")
        print("=" * 60)
        print(f"Usuarios: {len(usuarios)}")
        print(f"Ejercicios Condicionales: {len(ejercicios)}")
        print(f"Retos de Ciclos: {len(ciclos)}")
        print(f"Insignias: {len(insignias)}")
        
        # 8. Análisis de puntos
        if usuarios:
            total_puntos = sum(u.total_points for u in usuarios)
            usuarios_con_puntos = sum(1 for u in usuarios if u.total_points > 0)
            print(f"\nUsuarios con puntos: {usuarios_con_puntos}/{len(usuarios)}")
            print(f"Total de puntos en el sistema: {total_puntos}")
        
        # 9. Recomendaciones
        print("\n" + "=" * 60)
        print("🔧 RECOMENDACIONES")
        print("=" * 60)
        
        problemas = []
        
        if len(usuarios) == 0:
            problemas.append("No hay usuarios")
            print("  ⚠️  PROBLEMA: No hay usuarios en la BD")
            print("     SOLUCIÓN: python actualizar_bd.py")
        
        if len(usuarios) > 0 and all(u.total_points == 0 for u in usuarios):
            problemas.append("Usuarios sin puntos")
            print("  ⚠️  PROBLEMA: Todos los usuarios tienen 0 puntos")
            print("     SOLUCIÓN: python actualizar_bd.py")
        
        if len(ejercicios) < 10:
            problemas.append(f"Solo {len(ejercicios)} ejercicios")
            print(f"  ⚠️  PROBLEMA: Solo hay {len(ejercicios)} ejercicios (se esperan 15)")
            print("     SOLUCIÓN: python actualizar_bd.py")
        
        if len(ciclos) < 5:
            problemas.append(f"Solo {len(ciclos)} retos")
            print(f"  ⚠️  PROBLEMA: Solo hay {len(ciclos)} retos (se esperan 10)")
            print("     SOLUCIÓN: python actualizar_bd.py")
        
        if not problemas:
            print("  ✅ ¡Todo está correcto!")
            print("\n🎮 PASOS SIGUIENTES:")
            print("  1. Asegúrate de que el backend esté corriendo:")
            print("     uvicorn app.main:app --reload")
            print("  2. Recarga el navegador (F5)")
            print("  3. Verifica http://127.0.0.1:8000/docs")
        else:
            print(f"\n⚠️  Se encontraron {len(problemas)} problema(s)")
            print("\n🚀 EJECUTA:")
            print("   python actualizar_bd.py")
        
        print()
        
    except Exception as e:
        print(f"\n❌ Error durante el diagnóstico: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnosticar()