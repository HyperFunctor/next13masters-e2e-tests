# next13masters

## Zestaw testów e2e

### Uruchamianie testów e2e

1. Pobierz repozytorium z testami: https://github.com/typeofweb/next13masters-e2e-tets
2. Wyedytuj plik `.env` podając w nim adres swojej aplikacji na Vercelu (po module 1)
3. Nie modyfikuj żadnych plików w repozytorium poza `.env`.
4. Wejdź do folderu z pobranym repozytorium i uruchom `pnpm install`
5. Aby uruchomić test dla konkretnego modułu wywołaj polecenie:
6. `pnpm playwright test X.spec.ts` gdzie `X` jest liczbą od 1 do 4.
7. Wyniki testów będą widoczne w konsoli oraz są zapisywane w pliku `test-results.json`, który będzie nam potrzebny.
8. Do przeanalizowania krok po kroku testów możesz użyć komendy `pnpm playwright test --ui`.

**Powodzenia!**

⚠️ **Uwaga**: Jeśli używasz plików `loading.tsx` to pamiętaj, aby znalazł się w nich element z atrybutem `aria-busy="true"`.
