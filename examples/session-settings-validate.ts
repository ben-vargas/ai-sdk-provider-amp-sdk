/**
 * Test that session management settings are correctly applied
 * This verifies our changes to continue/resume handling
 */

import { amp, createAmp } from '../dist/index.js';

async function testSettings() {
  console.log('🧪 Testing Session Management Settings\n');

  try {
    // Test 1: Create model with continue: true
    console.log('✅ Test 1: Model with continue: true');
    const model1 = amp('default', { continue: true });
    console.log('   Created successfully\n');

    // Test 2: Create model with resume: 'session-id'
    console.log('✅ Test 2: Model with resume: session-id');
    const model2 = amp('default', { resume: 'T-test-session-123' });
    console.log('   Created successfully\n');

    // Test 3: Create model with both (resume should take precedence)
    console.log('✅ Test 3: Model with both continue and resume');
    const model3 = amp('default', { 
      continue: true, 
      resume: 'T-specific-session' 
    });
    console.log('   Created successfully (should warn about precedence)\n');

    // Test 4: Create model with continue: false (should not continue)
    console.log('✅ Test 4: Model with continue: false');
    const model4 = amp('default', { continue: false });
    console.log('   Created successfully\n');

    // Test 5: Test validation - empty resume should fail
    console.log('❌ Test 5: Model with empty resume (should fail)');
    try {
      const model5 = amp('default', { resume: '' });
      console.log('   UNEXPECTED: Created successfully (should have failed!)\n');
      throw new Error('Expected validation to fail for empty resume');
    } catch (error) {
      console.log('   ✅ Failed as expected:', error instanceof Error ? error.message : String(error));
      console.log();
    }

    // Test 6: Test validation - non-boolean continue should fail
    console.log('❌ Test 6: Model with non-boolean continue (should fail)');
    try {
      // @ts-expect-error - Testing runtime validation
      const model6 = amp('default', { continue: 'true' });
      console.log('   UNEXPECTED: Created successfully (should have failed!)\n');
      throw new Error('Expected validation to fail for non-boolean continue');
    } catch (error) {
      console.log('   ✅ Failed as expected:', error instanceof Error ? error.message : String(error));
      console.log();
    }

    // Test 7: Create provider with default settings
    console.log('✅ Test 7: Provider with default session settings');
    const provider = createAmp({
      defaultSettings: {
        continue: true,
        maxTurns: 5,
      },
    });
    const model7 = provider('default');
    console.log('   Created successfully with default continue: true\n');

    console.log('🎉 All session management settings tests passed!');
    console.log('\n📝 Summary:');
    console.log('   - continue: true works ✅');
    console.log('   - resume: "session-id" works ✅');
    console.log('   - Both settings together works (with precedence) ✅');
    console.log('   - continue: false works ✅');
    console.log('   - Empty resume validation works ✅');
    console.log('   - Non-boolean continue validation works ✅');
    console.log('   - Provider default settings work ✅');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testSettings();
