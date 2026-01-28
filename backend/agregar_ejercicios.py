"""
Script para agregar ejercicios de prueba a LogicQuest
Ejecutar desde la carpeta backend: python agregar_ejercicios.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine, Base
from app.models import User, Badge, Exercise, Cycle
import json

def agregar_ejercicios():
    """Agregar ejercicios y datos de prueba"""
    
    # Crear las tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("🚀 Agregando ejercicios y datos a LogicQuest...")
        print("=" * 60)
        
        # 1. CREAR USUARIOS
        print("\n👥 Creando usuarios...")
        usuarios = [
            {"name": "Johao Dorado", "points": 150},
            {"name": "Luis Roca", "points": 200},
            {"name": "Luis Vergara", "points": 180},
            {"name": "María González", "points": 120},
            {"name": "Pedro Ramírez", "points": 90},
            {"name": "Ana López", "points": 250},
            {"name": "Carlos Díaz", "points": 170},
            {"name": "Estudiante Demo", "points": 50},
        ]
        
        for user_data in usuarios:
            existing = db.query(User).filter(User.name == user_data["name"]).first()
            if not existing:
                user = User(name=user_data["name"], total_points=user_data["points"])
                db.add(user)
                print(f"  ✅ Usuario creado: {user_data['name']} ({user_data['points']} pts)")
            else:
                print(f"  ⚠️  Usuario ya existe: {user_data['name']}")
        
        db.commit()
        
        # 2. CREAR EJERCICIOS DE CONDICIONALES (15 ejercicios)
        print("\n📝 Creando ejercicios de condicionales...")
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
            },
            {
                "statement": "¿Qué imprime?\nint x = 15;\nif (x > 10 && x < 20) {\n    print('En rango');\n} else {\n    print('Fuera de rango');\n}",
                "options": ["En rango", "Fuera de rango", "15", "true"],
                "correct_index": 0
            },
            {
                "statement": "¿Cuál es la salida?\nif (!false) {\n    print('Correcto');\n} else {\n    print('Incorrecto');\n}",
                "options": ["Correcto", "Incorrecto", "false", "true"],
                "correct_index": 0
            },
            {
                "statement": "¿Qué imprime?\nint nota = 85;\nif (nota >= 90) {\n    print('A');\n} else if (nota >= 80) {\n    print('B');\n} else {\n    print('C');\n}",
                "options": ["A", "B", "C", "85"],
                "correct_index": 1
            },
            {
                "statement": "¿Cuál es el resultado?\nif (0) {\n    print('Verdadero');\n} else {\n    print('Falso');\n}",
                "options": ["Verdadero", "Falso", "0", "Error"],
                "correct_index": 1
            },
            {
                "statement": "¿Qué imprime?\nString text = 'hola';\nif (text == 'hola') {\n    print('Match');\n} else {\n    print('No match');\n}",
                "options": ["Match", "No match", "hola", "Error"],
                "correct_index": 0
            },
            {
                "statement": "¿Cuál es la salida?\nint a = 5, b = 5;\nif (a == b) {\n    print('Iguales');\n} else {\n    print('Diferentes');\n}",
                "options": ["Iguales", "Diferentes", "5", "true"],
                "correct_index": 0
            },
            {
                "statement": "¿Qué imprime?\nif (3 > 2 && 2 > 1) {\n    print('Todas verdaderas');\n} else {\n    print('Alguna falsa');\n}",
                "options": ["Todas verdaderas", "Alguna falsa", "true", "3"],
                "correct_index": 0
            },
            {
                "statement": "¿Cuál es el resultado?\nint x = -5;\nif (x > 0) {\n    print('Positivo');\n} else if (x < 0) {\n    print('Negativo');\n} else {\n    print('Cero');\n}",
                "options": ["Positivo", "Negativo", "Cero", "-5"],
                "correct_index": 1
            },
            {
                "statement": "¿Qué imprime?\nboolean flag = true;\nif (flag) {\n    print('Activo');\n} else {\n    print('Inactivo');\n}",
                "options": ["Activo", "Inactivo", "true", "false"],
                "correct_index": 0
            },
            {
                "statement": "¿Cuál es la salida?\nif ('a' < 'b') {\n    print('a es menor');\n} else {\n    print('b es menor');\n}",
                "options": ["a es menor", "b es menor", "a", "Error"],
                "correct_index": 0
            }
        ]
        
        count = db.query(Exercise).filter(Exercise.module == "condicionales").count()
        if count == 0:
            for i, ej in enumerate(ejercicios, 1):
                exercise = Exercise(
                    module="condicionales",
                    statement=ej["statement"],
                    options_json=json.dumps(ej["options"], ensure_ascii=False),
                    correct_index=ej["correct_index"],
                    is_active=True
                )
                db.add(exercise)
                print(f"  ✅ Ejercicio {i}/15 creado")
            db.commit()
            print(f"  🎉 Total: {len(ejercicios)} ejercicios de condicionales agregados")
        else:
            print(f"  ⚠️  Ya existen {count} ejercicios de condicionales")
        
        # 3. CREAR RETOS DE CICLOS (10 retos)
        print("\n🔄 Creando retos de ciclos...")
        retos = [
            {
                "title": "Números del 1 al 5",
                "description": "Completa las salidas para imprimir números del 1 al 5",
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
                "title": "Cuenta regresiva",
                "description": "Imprime una cuenta regresiva desde N hasta 1 usando while.",
                "loop_type": "while",
                "difficulty": "medio",
                "test_cases": [
                    {"input": "3", "output": "3 2 1"},
                    {"input": "2", "output": "2 1"},
                    {"input": "5", "output": "5 4 3 2 1"}
                ],
                "points": 25
            },
            {
                "title": "Tabla del 2",
                "description": "Completa la tabla de multiplicar del 2 (del 1 al 5)",
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
                "description": "Imprime solo números pares del 2 al 10",
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
            },
            {
                "title": "Cuenta Regresiva",
                "description": "Cuenta regresiva desde 5 hasta 1",
                "loop_type": "for",
                "difficulty": "facil",
                "test_cases": [
                    {"input": "1", "output": "5"},
                    {"input": "2", "output": "4"},
                    {"input": "3", "output": "3"},
                    {"input": "4", "output": "2"},
                    {"input": "5", "output": "1"}
                ],
                "points": 15
            },
            {
                "title": "Tabla del 3",
                "description": "Tabla de multiplicar del 3 (del 1 al 5)",
                "loop_type": "for",
                "difficulty": "medio",
                "test_cases": [
                    {"input": "1", "output": "3"},
                    {"input": "2", "output": "6"},
                    {"input": "3", "output": "9"},
                    {"input": "4", "output": "12"},
                    {"input": "5", "output": "15"}
                ],
                "points": 20
            },
            {
                "title": "Números Impares",
                "description": "Imprime números impares del 1 al 9",
                "loop_type": "for",
                "difficulty": "medio",
                "test_cases": [
                    {"input": "1", "output": "1"},
                    {"input": "2", "output": "3"},
                    {"input": "3", "output": "5"},
                    {"input": "4", "output": "7"},
                    {"input": "5", "output": "9"}
                ],
                "points": 20
            },
            {
                "title": "Suma Acumulativa",
                "description": "Suma acumulativa: 1, 1+2, 1+2+3, 1+2+3+4, 1+2+3+4+5",
                "loop_type": "for",
                "difficulty": "dificil",
                "test_cases": [
                    {"input": "1", "output": "1"},
                    {"input": "2", "output": "3"},
                    {"input": "3", "output": "6"},
                    {"input": "4", "output": "10"},
                    {"input": "5", "output": "15"}
                ],
                "points": 30
            },
            {
                "title": "Potencias de 2",
                "description": "Calcula potencias de 2: 2^1, 2^2, 2^3, 2^4, 2^5",
                "loop_type": "for",
                "difficulty": "dificil",
                "test_cases": [
                    {"input": "1", "output": "2"},
                    {"input": "2", "output": "4"},
                    {"input": "3", "output": "8"},
                    {"input": "4", "output": "16"},
                    {"input": "5", "output": "32"}
                ],
                "points": 30
            },
            {
                "title": "Múltiplos de 5",
                "description": "Imprime múltiplos de 5 hasta 25",
                "loop_type": "for",
                "difficulty": "medio",
                "test_cases": [
                    {"input": "1", "output": "5"},
                    {"input": "2", "output": "10"},
                    {"input": "3", "output": "15"},
                    {"input": "4", "output": "20"},
                    {"input": "5", "output": "25"}
                ],
                "points": 20
            },
            {
                "title": "Tabla del 10",
                "description": "Tabla de multiplicar del 10 (del 1 al 5)",
                "loop_type": "for",
                "difficulty": "facil",
                "test_cases": [
                    {"input": "1", "output": "10"},
                    {"input": "2", "output": "20"},
                    {"input": "3", "output": "30"},
                    {"input": "4", "output": "40"},
                    {"input": "5", "output": "50"}
                ],
                "points": 15
            }
        ]
        
        count = db.query(Cycle).count()
        if count == 0:
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
                print(f"  ✅ Reto {i}/10 creado: {reto['title']}")
            db.commit()
            print(f"  🎉 Total: {len(retos)} retos de ciclos agregados")
        else:
            print(f"  ⚠️  Ya existen {count} retos de ciclos")
        
        # 4. CREAR INSIGNIAS
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
        print("✅ ¡Datos agregados exitosamente!")
        print("\n📊 Resumen:")
        print(f"   👥 Usuarios: {db.query(User).count()}")
        print(f"   📝 Ejercicios Condicionales: {db.query(Exercise).filter(Exercise.module == 'condicionales').count()}")
        print(f"   🔄 Retos de Ciclos: {db.query(Cycle).count()}")
        print(f"   🏅 Insignias: {db.query(Badge).count()}")
        print("\n🎮 Ahora recarga tu aplicación y verás:")
        print("   • 15 ejercicios de condicionales")
        print("   • 10 retos de ciclos")
        print("   • 8 usuarios en el ranking")
        print("   • Sistema de insignias funcionando")
        print("\n🚀 ¡Disfruta LogicQuest!\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    agregar_ejercicios()