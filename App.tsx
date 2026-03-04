import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  Modal, 
  Alert, 
  Dimensions, 
  Platform, 
  StatusBar as RNStatusBar 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  Home, 
  ClipboardCheck, 
  Activity, 
  User, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  Flame, 
  Footprints, 
  Scale, 
  Bell, 
  Settings, 
  Info 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Types ---
type Screen = 'dashboard' | 'tests' | 'tracker' | 'profile' | 'add-food' | 'bmi' | 'steps' | 'info';

interface UserData {
  name: string;
  email: string;
  age: number;
  isEditing: boolean;
}

interface BMIEntry {
  bmi: number;
  date: string;
  weight: number;
}

// --- Components ---

const BottomNav = ({ current, setScreen }: { current: Screen, setScreen: (s: Screen) => void }) => {
  const navItems = [
    { id: 'dashboard' as Screen, label: 'Ana Sayfa', icon: Home },
    { id: 'tests' as Screen, label: 'Testler', icon: ClipboardCheck },
    { id: 'tracker' as Screen, label: 'Takip', icon: Activity },
    { id: 'profile' as Screen, label: 'Profil', icon: User },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = current === item.id;
        return (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => setScreen(item.id)}
            style={styles.navItem}
          >
            <Icon size={24} color={isActive ? '#dc2828' : '#94a3b8'} strokeWidth={isActive ? 2.5 : 2} />
            <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Header = ({ title, onBack, rightAction }: { title: string, onBack?: () => void, rightAction?: React.ReactNode }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    {rightAction}
  </View>
);

// --- Screens ---

const Dashboard = ({ setScreen, steps, calories, user, onToggleNotifications }: any) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.greetingContainer}>
        <View>
          <Text style={styles.greetingText}>Merhaba {user.name.split(' ')[0]}! 👋</Text>
          <Text style={styles.subGreetingText}>Bugün risk skorun düşük, harikasın!</Text>
        </View>
        <TouchableOpacity onPress={onToggleNotifications} style={styles.iconButton}>
          <Bell size={20} color="#1e293b" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>85</Text>
          <Text style={styles.scoreLabel}>Sağlık Puanı</Text>
          <View style={styles.scoreTrend}>
            <Activity size={12} color="#10B981" />
            <Text style={styles.trendText}>+5 Artış</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        {[
          { id: 'bmi' as Screen, label: 'BKİ', icon: Scale, color: '#3b82f6' },
          { id: 'add-food' as Screen, label: 'Besin', icon: Plus, color: '#f97316' },
          { id: 'steps' as Screen, label: 'Adım', icon: Footprints, color: '#10b981' },
          { id: 'tests' as Screen, label: 'Test', icon: ClipboardCheck, color: '#a855f7' },
        ].map((action) => (
          <TouchableOpacity 
            key={action.id} 
            onPress={() => setScreen(action.id)}
            style={styles.actionItem}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <action.icon size={24} color="white" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={() => setScreen('steps')} style={styles.statCard}>
          <View style={styles.statInfo}>
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(220, 40, 40, 0.1)' }]}>
              <Footprints size={20} color="#dc2828" />
            </View>
            <View>
              <Text style={styles.statTitle}>Bugünkü Adım</Text>
              <Text style={styles.statValue}>{steps.toLocaleString()} <Text style={styles.statTarget}>/ 10k</Text></Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min((steps/10000)*100, 100)}%` }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('add-food')} style={styles.statCard}>
          <View style={styles.statInfo}>
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <Flame size={20} color="#f97316" />
            </View>
            <View>
              <Text style={styles.statTitle}>Kalori Alımı</Text>
              <Text style={styles.statValue}>{calories.toLocaleString()} <Text style={styles.statUnit}>kcal</Text></Text>
            </View>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Tests = ({ setActiveTest }: any) => (
  <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
    <View style={styles.screenHeader}>
      <Text style={styles.screenTitle}>Risk Testleri</Text>
      <Text style={styles.screenSubTitle}>Diyabet riskinizi ölçmek için bilimsel testleri tamamlayın.</Text>
    </View>

    <View style={styles.testList}>
      {[
        { id: 0, title: 'FINDRISK Testi', desc: 'Tip-2 Diyabet riskinizi 8 soruda öğrenin.', status: 'Tamamlandı', score: '12 Puan' },
        { id: 1, title: 'Beslenme Alışkanlığı', desc: 'Günlük beslenme düzeninizi analiz edin.', status: 'Bekliyor', score: '-' },
        { id: 2, title: 'Fiziksel Aktivite', desc: 'Hareket seviyenizi değerlendirin.', status: 'Bekliyor', score: '-' },
      ].map((test, i) => (
        <View key={i} style={styles.testCard}>
          <View style={styles.testHeader}>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>{test.title}</Text>
              <Text style={styles.testDesc}>{test.desc}</Text>
            </View>
            <View style={[styles.statusBadge, test.status === 'Tamamlandı' ? styles.statusCompleted : styles.statusPending]}>
              <Text style={[styles.statusText, test.status === 'Tamamlandı' ? styles.statusTextCompleted : styles.statusTextPending]}>{test.status}</Text>
            </View>
          </View>
          <View style={styles.testFooter}>
            <Text style={styles.testScore}>{test.score}</Text>
            <TouchableOpacity 
              onPress={() => test.id === 0 ? setActiveTest(0) : Alert.alert('Bilgi', 'Bu test yakında eklenecek!')}
              style={styles.testButton}
            >
              <Text style={styles.testButtonText}>{test.status === 'Tamamlandı' ? 'Tekrar Çöz' : 'Şimdi Başla'}</Text>
              <ChevronRight size={16} color="#dc2828" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
);

const AddFood = ({ onBack, onAdd }: any) => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Hepsi');
  const foods = [
    { name: 'Yulaf Ezmesi', cal: 389, calStr: '389 kcal / 100g', cat: 'Tahıllar' },
    { name: 'Yumurta', cal: 78, calStr: '78 kcal / Adet', cat: 'Proteinler' },
    { name: 'Elma', cal: 52, calStr: '52 kcal / 100g', cat: 'Meyveler' },
    { name: 'Tavuk Göğsü', cal: 165, calStr: '165 kcal / 100g', cat: 'Proteinler' },
    { name: 'Domates', cal: 18, calStr: '18 kcal / 100g', cat: 'Sebzeler' },
    { name: 'Tam Buğday Ekmeği', cal: 69, calStr: '69 kcal / Dilim', cat: 'Tahıllar' },
  ];

  const filteredFoods = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'Hepsi' || f.cat === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <View style={styles.fullScreen}>
      <Header title="Besin Ekle" onBack={onBack} />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Besin veya marka ara..." 
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
        {['Hepsi', 'Tahıllar', 'Proteinler', 'Sebzeler', 'Meyveler'].map((cat) => (
          <TouchableOpacity 
            key={cat} 
            onPress={() => setActiveCat(cat)}
            style={[styles.categoryPill, activeCat === cat && styles.activeCategoryPill]}
          >
            <Text style={[styles.categoryText, activeCat === cat && styles.activeCategoryText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>{search || activeCat !== 'Hepsi' ? 'Arama Sonuçları' : 'Sık Kullanılanlar'}</Text>
        <View style={styles.foodList}>
          {filteredFoods.length > 0 ? filteredFoods.map((food, i) => (
            <View key={i} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <View style={styles.foodIcon}>
                  <Plus size={20} color="#dc2828" />
                </View>
                <View>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodCal}>{food.calStr}</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  onAdd(food.cal);
                  Alert.alert('Başarılı', `${food.name} eklendi!`);
                }}
                style={styles.addButton}
              >
                <Plus size={18} color="white" />
              </TouchableOpacity>
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Search size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Besin bulunamadı.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const BMICalculator = ({ onBack, onSave, history }: any) => {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState(22.9);

  useEffect(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(Math.round((w / (h * h)) * 10) / 10);
    }
  }, [height, weight]);

  return (
    <View style={styles.fullScreen}>
      <Header title="BKİ Hesaplayıcı" onBack={onBack} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputGrid}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Boy (cm)</Text>
            <TextInput 
              keyboardType="numeric"
              value={height} 
              onChangeText={setHeight}
              style={styles.bmiInput}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Kilo (kg)</Text>
            <TextInput 
              keyboardType="numeric"
              value={weight} 
              onChangeText={setWeight}
              style={styles.bmiInput}
            />
          </View>
        </View>

        <View style={styles.bmiResultCard}>
          <View style={styles.bmiGauge}>
            <View style={[styles.bmiGaugeFill, { width: `${Math.min((bmi/40)*100, 100)}%` }]} />
          </View>
          <Text style={styles.bmiResultLabel}>Vücut Kitle Endeksiniz</Text>
          <Text style={styles.bmiValue}>{bmi}</Text>
          <View style={[styles.bmiStatusBadge, bmi < 18.5 ? styles.bmiUnder : bmi < 25 ? styles.bmiNormal : styles.bmiOver]}>
            <Text style={[styles.bmiStatusText, bmi < 18.5 ? styles.bmiTextUnder : bmi < 25 ? styles.bmiTextNormal : styles.bmiTextOver]}>
              {bmi < 18.5 ? 'Zayıf' : bmi < 25 ? 'Normal Kilolu' : 'Fazla Kilolu'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              onSave(bmi, parseFloat(weight));
              Alert.alert('Başarılı', 'Ölçüm kaydedildi!');
            }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Kaydı Kaydet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Geçmiş Kayıtlar</Text>
          <View style={styles.historyList}>
            {history.map((h: any, i: number) => (
              <View key={i} style={styles.historyCard}>
                <View>
                  <Text style={styles.historyBmi}>{h.bmi} BKİ</Text>
                  <Text style={styles.historyDate}>{h.date}</Text>
                </View>
                <Text style={styles.historyWeight}>{h.weight} kg</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [dailyCalories, setDailyCalories] = useState(1420);
  const [steps, setSteps] = useState(8540);
  const [bmiHistory, setBmiHistory] = useState<BMIEntry[]>([
    { bmi: 23.1, date: 'Dün, 09:45', weight: 70.2 }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTest, setActiveTest] = useState<number | null>(null);
  const [testStep, setTestStep] = useState(0);
  const [user, setUser] = useState<UserData>({
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    age: 28,
    isEditing: false
  });

  const handleBack = () => setScreen('dashboard');

  const addCalories = (cal: number) => {
    setDailyCalories(prev => prev + cal);
  };

  const addSteps = (s: number) => {
    setSteps(prev => prev + s);
  };

  const saveBmi = (bmi: number, weight: number) => {
    const now = new Date();
    const dateStr = `Bugün, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setBmiHistory(prev => [{ bmi, weight, date: dateStr }, ...prev]);
  };

  const findriskQuestions = [
    { q: 'Yaşınız kaç?', options: ['45 altı', '45-54', '55-64', '64 üstü'] },
    { q: 'Vücut kitle endeksiniz?', options: ['25 altı', '25-30', '30 üstü'] },
    { q: 'Bel çevreniz?', options: ['Erkek <94, Kadın <80', 'Erkek 94-102, Kadın 80-88', 'Erkek >102, Kadın >88'] },
    { q: 'Günde en az 30 dk fiziksel aktivite yapar mısınız?', options: ['Evet', 'Hayır'] },
  ];

  const renderScreen = () => {
    if (activeTest !== null) {
      return (
        <View style={styles.fullScreen}>
          <Header title="FINDRISK Testi" onBack={() => setActiveTest(null)} />
          <View style={styles.p4}>
            <View style={styles.testProgressHeader}>
              <Text style={styles.testProgressTitle}>FINDRISK Testi</Text>
              <Text style={styles.testProgressStep}>{testStep + 1} / {findriskQuestions.length}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${((testStep + 1) / findriskQuestions.length) * 100}%` }]} />
            </View>
            <View style={styles.testQuestionCard}>
              <Text style={styles.testQuestionText}>{findriskQuestions[testStep].q}</Text>
              <View style={styles.testOptions}>
                {findriskQuestions[testStep].options.map((opt, i) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => {
                      if (testStep < findriskQuestions.length - 1) {
                        setTestStep(testStep + 1);
                      } else {
                        Alert.alert('Tebrikler', 'Test tamamlandı! Risk skorunuz hesaplanıyor...');
                        setActiveTest(null);
                        setTestStep(0);
                      }
                    }}
                    style={styles.testOptionButton}
                  >
                    <Text style={styles.testOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity onPress={() => setActiveTest(null)} style={styles.exitTestButton}>
              <Text style={styles.exitTestText}>Testten Çık</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard 
            setScreen={setScreen} 
            steps={steps} 
            calories={dailyCalories} 
            user={user}
            onToggleNotifications={() => setShowNotifications(true)}
          />
        );
      case 'tests':
        return <Tests setActiveTest={setActiveTest} />;
      case 'add-food':
        return <AddFood onBack={handleBack} onAdd={addCalories} />;
      case 'bmi':
        return <BMICalculator onBack={handleBack} onSave={saveBmi} history={bmiHistory} />;
      case 'steps':
        return (
          <View style={styles.fullScreen}>
            <Header title="Adımsayar" onBack={handleBack} />
            <ScrollView style={styles.container} contentContainerStyle={styles.stepsContent}>
              <View style={styles.stepsGaugeContainer}>
                <View style={styles.stepsGauge}>
                  <Footprints size={48} color="#10b981" />
                  <Text style={styles.stepsValueText}>{steps.toLocaleString()}</Text>
                  <Text style={styles.stepsLabelText}>ADIM</Text>
                </View>
              </View>
              <View style={styles.stepsTargetInfo}>
                <Text style={styles.stepsTargetLabel}>Günlük Hedef</Text>
                <Text style={styles.stepsTargetValue}>{steps.toLocaleString()} / 10,000</Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => addSteps(500)}
                style={styles.simulateButton}
              >
                <Text style={styles.simulateButtonText}>Adım Simüle Et (+500)</Text>
              </TouchableOpacity>

              <View style={styles.stepsGrid}>
                <View style={styles.stepsGridItem}>
                  <Text style={styles.gridLabel}>KM</Text>
                  <Text style={styles.gridValue}>{(steps * 0.0007).toFixed(1)}</Text>
                </View>
                <View style={styles.stepsGridItem}>
                  <Text style={styles.gridLabel}>KCAL</Text>
                  <Text style={styles.gridValue}>{(steps * 0.04).toFixed(0)}</Text>
                </View>
                <View style={styles.stepsGridItem}>
                  <Text style={styles.gridLabel}>DAKİKA</Text>
                  <Text style={styles.gridValue}>{(steps / 100).toFixed(0)}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.fullScreen}>
            <Header title="Profil" />
            <ScrollView style={styles.container} contentContainerStyle={styles.profileContent}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <User size={60} color="#dc2828" />
                  </View>
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.profileInfo}>
                  {user.isEditing ? (
                    <TextInput 
                      style={styles.nameInput}
                      value={user.name}
                      onChangeText={text => setUser({...user, name: text})}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.profileName}>{user.name}</Text>
                  )}
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.profileStats}>
                <View style={styles.profileStatCard}>
                  <Text style={styles.profileStatLabel}>Son BKİ</Text>
                  <Text style={styles.profileStatValue}>{bmiHistory[0]?.bmi || '-'}</Text>
                </View>
                <View style={styles.profileStatCard}>
                  <Text style={styles.profileStatLabel}>Yaş</Text>
                  <Text style={styles.profileStatValue}>{user.age}</Text>
                </View>
              </View>

              <View style={styles.profileMenu}>
                {[
                  { label: user.isEditing ? 'Değişiklikleri Kaydet' : 'Kişisel Bilgileri Düzenle', icon: User, action: () => setUser({...user, isEditing: !user.isEditing}) },
                  { label: 'Uygulama Ayarları', icon: Settings, action: () => Alert.alert('Bilgi', 'Ayarlar yakında eklenecek!') },
                  { label: 'Bildirimler', icon: Bell, action: () => Alert.alert('Bilgi', 'Bildirim ayarları yakında eklenecek!') },
                  { label: 'Hakkında & İletişim', icon: Info, action: () => setScreen('info') },
                ].map((item, i) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={item.action}
                    style={[styles.menuItem, i === 0 && user.isEditing && styles.activeMenuItem]}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconWrapper}>
                        <item.icon size={20} color="#64748b" />
                      </View>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                onPress={() => Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
                  { text: 'İptal', style: 'cancel' },
                  { text: 'Evet', onPress: () => setScreen('dashboard') }
                ])}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );
      case 'info':
        return (
          <View style={styles.fullScreen}>
            <Header title="Bilgi & İletişim" onBack={() => setScreen('profile')} />
            <ScrollView style={styles.container} contentContainerStyle={styles.infoContent}>
              <View style={styles.infoHero}>
                <Activity size={60} color="#dc2828" />
                <Text style={styles.infoHeroTitle}>Sağlıklı Yaşam Rehberi</Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Prediyabet Nedir?</Text>
                <Text style={styles.infoText}>
                  Prediyabet, kan şekeri seviyelerinin normalden yüksek olduğu ancak henüz tip 2 diyabet teşhisi konacak kadar yüksek olmadığı bir durumdur. 
                  Yaşam tarzı değişiklikleri ile bu durumun diyabete dönüşmesi engellenebilir.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>İletişim</Text>
                <View style={styles.contactList}>
                  <TouchableOpacity style={styles.contactItem}>
                    <View style={styles.contactIconWrapper}>
                      <Activity size={16} color="#10b981" />
                    </View>
                    <Text style={styles.contactText}>destek@prediabet-tr.com</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactItem}>
                    <View style={[styles.contactIconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                      <Activity size={16} color="#3b82f6" />
                    </View>
                    <Text style={styles.contactText}>+90 (212) 555 01 01</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      default:
        return <Dashboard setScreen={setScreen} steps={steps} calories={dailyCalories} user={user} onToggleNotifications={() => setShowNotifications(true)} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.mainContainer}>
        {renderScreen()}
        {['dashboard', 'tests', 'tracker', 'profile'].includes(screen) && activeTest === null && (
          <BottomNav current={screen} setScreen={setScreen} />
        )}
      </View>

      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bildirimler</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Plus size={24} color="#1e293b" style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notificationList}>
              {[
                { title: 'Su İçme Zamanı!', desc: 'Vücudunu susuz bırakma, bir bardak su iç.', time: '10 dk önce' },
                { title: 'Hedefe Yaklaştın', desc: 'Günlük adım hedefinin %85\'ini tamamladın!', time: '1 saat önce' },
              ].map((n, i) => (
                <View key={i} style={styles.notificationCard}>
                  <Text style={styles.notificationCardTitle}>{n.title}</Text>
                  <Text style={styles.notificationCardDesc}>{n.desc}</Text>
                  <Text style={styles.notificationCardTime}>{n.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f6f6',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  mainContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  p4: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(248, 246, 246, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeNavLabel: {
    color: '#dc2828',
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subGreetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#dc2828',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 10,
    borderColor: 'rgba(220, 40, 40, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#dc2828',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  scoreTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statTarget: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#94a3b8',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#94a3b8',
  },
  progressBarContainer: {
    width: 100,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#dc2828',
    borderRadius: 4,
  },
  screenHeader: {
    padding: 16,
    gap: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  screenSubTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  testList: {
    padding: 16,
    gap: 16,
  },
  testCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  testInfo: {
    flex: 1,
    gap: 4,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  testDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusPending: {
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextCompleted: {
    color: '#10B981',
  },
  statusTextPending: {
    color: '#64748b',
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  testScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2828',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2828',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  activeCategoryPill: {
    backgroundColor: '#dc2828',
    borderColor: '#dc2828',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  activeCategoryText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  foodList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  foodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 40, 40, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  foodCal: {
    fontSize: 10,
    color: '#64748b',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2828',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
  },
  bmiInput: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bmiResultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 32,
    borderRadius: 30,
    alignItems: 'center',
    gap: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bmiGauge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(220, 40, 40, 0.1)',
  },
  bmiGaugeFill: {
    height: '100%',
    backgroundColor: '#dc2828',
  },
  bmiResultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  bmiValue: {
    fontSize: 60,
    fontWeight: '900',
    color: '#dc2828',
  },
  bmiStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bmiUnder: { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  bmiNormal: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  bmiOver: { backgroundColor: 'rgba(249, 115, 22, 0.1)' },
  bmiStatusText: { fontWeight: 'bold' },
  bmiTextUnder: { color: '#3b82f6' },
  bmiTextNormal: { color: '#10B981' },
  bmiTextOver: { color: '#f97316' },
  saveButton: {
    width: '100%',
    backgroundColor: '#dc2828',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historySection: {
    marginTop: 32,
  },
  historyList: {
    gap: 8,
    marginTop: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  historyBmi: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  historyDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  testProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testProgressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  testProgressStep: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2828',
  },
  testQuestionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 24,
    borderRadius: 20,
    marginTop: 16,
    gap: 24,
  },
  testQuestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  testOptions: {
    gap: 12,
  },
  testOptionButton: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderRadius: 16,
  },
  testOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  exitTestButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  exitTestText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  stepsContent: {
    padding: 32,
    alignItems: 'center',
    gap: 32,
  },
  stepsGaugeContainer: {
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 12,
    borderColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepsGauge: {
    alignItems: 'center',
  },
  stepsValueText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0f172a',
  },
  stepsLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  stepsTargetInfo: {
    alignItems: 'center',
    gap: 4,
  },
  stepsTargetLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepsTargetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  simulateButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#10b981',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  simulateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  stepsGridItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: 'rgba(220, 40, 40, 0.2)',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: '#dc2828',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#dc2828',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  profileStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: 'rgba(220, 40, 40, 0.05)',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(220, 40, 40, 0.1)',
  },
  profileStatLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  profileStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileMenu: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeMenuItem: {
    borderColor: '#dc2828',
    backgroundColor: 'rgba(220, 40, 40, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoutButton: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2828',
  },
  infoContent: {
    padding: 16,
    gap: 24,
  },
  infoHero: {
    aspectRatio: 1.77,
    backgroundColor: 'rgba(220, 40, 40, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  infoHeroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2828',
  },
  infoSection: {
    gap: 12,
  },
  infoSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  contactList: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
  },
  contactIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  notificationList: {
    gap: 12,
  },
  notificationCard: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  notificationCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  notificationCardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  notificationCardTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
  },
});
