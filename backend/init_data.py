"""
Script de inicialización de datos de prueba para LogicQuest
Ejecutar DESPUÉS de que el servidor esté corriendo
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine, Base
from app.models import User, Badge, Exercise, Cycle
import json

def init_database():
    """Inicializar datos de prueba directamente en la base de datos"""
    
    # Crear las tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("🚀 Iniciando configuración de datos de prueba para LogicQuest...")
        print("=" * 60)
        
        # 1. Crear usuarios
        print("\n📝 Creando usuarios...")
        usuarios = [
            User(name="Johao Dorado", total_points=0),
            User(name="Luis Roca", total_points=0),
            User(name="Luis Vergara", total_points=0),
            User(name="Estudiante Demo", total_points=0),
        ]
        
        for user in usuarios:
            existing = db.query(User).filter(User.name == user.name).first()
            if not existing:
                db.add(user)
                print(f"  ✅ Usuario creado: {user.name}")
            else:
                print(f"  ⚠️  Usuario ya existe: {user.name}")
        
        db.commit()
        
        # 2. Crear ejercicios de condicionales
        print("\n📚 Creando ejercicios de condicionales...")
        ejercicios = [
            {
                "statement": "¿Cuál es la salida del siguiente código?\nif (10 > 5) {\n    print('Mayor');\n} else {\n    print('Menor');\n}",
                "options": ["Mayor", "Menor", "Error", "Nada"],
                "correct_index": 0
            },
            {
                "statement": "¿Qué imprime este código?\nint x = 3;\nif (x % 2 == 0) {\n    print('Par');\n} else {\n    print('Impar');\n}",
                "options": ["Par", "Impar", "3", "Error"],
                "correct_index": 1
            },
            {
                "statement": "¿Cuál es el resultado?\nif (5 == 5 && 3 < 2) {\n    print('A');\n} else {\n    print('B');\n}",
                "options": ["A", "B", "true", "false"],
                "correct_index": 1
            },
            {
                "statement": "¿Qué se imprime?\nint edad = 18;\nif (edad >= 18) {\n    print('Mayor de edad');\n} else {\n    print('Menor de edad');\n}",
                "options": ["Mayor de edad", "Menor de edad", "18", "Error"],
                "correct_index": 0
            },
            {
                "statement": "¿Cuál es la salida?\nif (true || false) {\n    print('Sí');\n} else {\n    print('No');\n}",
                "options": ["Sí", "No", "true", "false"],
                "correct_index": 0
            }
        ]
        
        for i, ej in enumerate(ejercicios, 1):
            exercise = Exercise(
                module="condicionales",
                statement=ej["statement"],
                options_json=json.dumps(ej["options"], ensure_ascii=False),
                correct_index=ej["correct_index"],
                is_active=True
            )
            db.add(exercise)
            print(f"  ✅ Ejercicio {i} creado")
        
        db.commit()
        
        # 3. Crear retos de ciclos
        print("\n🔄 Creando retos de ciclos...")
        retos = [
            {
                "title": "Bucle For Simple",
                "description": "Completa las salidas para los números del 1 al 5",
                "loop_type": "for",
                "difficulty": "facil",
                "test_cases": [
                    {"input": "1", "output": "1"},
                    {"input": "2", "output": "2"},
                    {"input": "3", "output": "3"},
                    {"input": "4", "output": "4"},
                    {"input": "5", "output": "5"}
                ],
                "points": 10
            },
            {
                "title": "Tabla de Multiplicar",
                "description": "Completa la tabla del 2",
                "loop_type": "for",
                "difficulty": "facil",
                "test_cases": [
                    {"input": "1", "output": "2"},
                    {"input": "2", "output": "4"},
                    {"input": "3", "output": "6"},
                    {"input": "4", "output": "8"},
                    {"input": "5", "output": "10"}
                ],
                "points": 15
            },
            {
                "title": "Números Pares",
                "description": "Completa la secuencia de números pares",
                "loop_type": "for",
                "difficulty": "medio",
                "test_cases": [
                    {"input": "1", "output": "2"},
                    {"input": "2", "output": "4"},
                    {"input": "3", "output": "6"},
                    {"input": "4", "output": "8"},
                    {"input": "5", "output": "10"}
                ],
                "points": 20
            }
        ]
        
        for i, reto in enumerate(retos, 1):
            cycle = Cycle(
                title=reto["title"],
                description=reto["description"],
                difficulty=reto["difficulty"],
                loop_type=reto["loop_type"],
                test_cases_json=json.dumps(reto["test_cases"], ensure_ascii=False),
                points=reto["points"]
            )
            db.add(cycle)
            print(f"  ✅ Reto {i} creado: {reto['title']}")
        
        db.commit()
        
        # 4. Crear insignias
        print("\n🏅 Creando insignias...")
        insignias = [
            {"code": "COND_MASTER", "name": "Maestro Condicional", "points": 50},
            {"code": "LOOP_PRO", "name": "Domina los Bucles", "points": 75},
            {"code": "FIRST_STEPS", "name": "Primeros Pasos", "points": 10},
            {"code": "LOGIC_KING", "name": "Rey de la Lógica", "points": 100},
            {"code": "PERSISTENT", "name": "Persistente", "points": 25},
        ]
        
        for insignia in insignias:
            existing = db.query(Badge).filter(Badge.code == insignia["code"]).first()
            if not existing:
                badge = Badge(
                    code=insignia["code"],
                    name=insignia["name"],
                    points=insignia["points"]
                )
                db.add(badge)
                print(f"  ✅ Insignia creada: {insignia['name']}")
            else:
                print(f"  ⚠️  Insignia ya existe: {insignia['name']}")
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("✅ ¡Configuración completada exitosamente!")
        print("\n💡 Ahora puedes:")
        print("   1. Iniciar el backend: uvicorn app.main:app --reload")
        print("   2. Abrir el frontend en http://localhost:5173")
        print("   3. Explorar la API en http://127.0.0.1:8000/docs")
        print("\n🎮 ¡Disfruta LogicQuest!\n")
        
    except Exception as e:
        print(f"\n❌ Error durante la inicialización: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()