import { Redirect } from 'expo-router';

export default function FoodRecScreen() {
  // Begitu user menekan tab food_rec, sistem otomatis melempar ke halaman form_resep
  return <Redirect href="/from_resep" />;
}